import { useEffect, useMemo, useState } from "react";
import { gql, request } from "graphql-request";
import { CHAIN_SUBGRAPH_URL } from "../../../constants/subgraph";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const MARKET_ANALYTICS_QUERY = gql`
  query MyQuery($marketIds: [String!]!) {
    markets(where: { id_in: $marketIds }) {
      totalVolume
      numberOfBuilds
      numberOfUnwinds
      numberOfLiquidates
    }
    tokenPositions(where: { owner_in: $marketIds }) {
      balance
    }
  }
`;

type MarketData = {
  totalVolume: string;
  numberOfBuilds: string;
  numberOfUnwinds: string;
  numberOfLiquidates: string;
};

type BalanceData = {
  balance: string;
};

type AnalyticsData = {
  markets: MarketData[];
  tokenPositions: BalanceData[];
};

const EMPTY_VALUE = " ";

export function useMarketAnalytics() {
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];
  const { currentMarket } = useCurrentMarketState();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [oraclePrice, setOraclePrice] = useState<bigint | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const fetchOraclePrice = async () => {
      try {
        const price = await sdk.lbsc.getOraclePrice();
        if (!cancelled) {
          setOraclePrice(price);
        }
      } catch (error) {
        console.error("Error fetching oracle price:", error);
      }
    };

    fetchOraclePrice();

    return () => {
      cancelled = true;
    };
  }, [sdk]);

  useEffect(() => {
    let cancelled = false;
    const requestedMarketId = currentMarket?.marketId;

    const fetchData = async () => {
      if (!currentMarket || !subgraphUrl) return;

      try {
        const marketsDetailsMap = await sdk.markets.getAllMarketsDetails();

        const marketAddresses = Array.from(marketsDetailsMap.values())
          .filter((market) => market.marketId === requestedMarketId)
          .map((market) => market.id.toLowerCase());

        const addressesToQuery =
          marketAddresses.length > 0
            ? marketAddresses
            : [currentMarket.id.toLowerCase()];

        const data: AnalyticsData = await request(
          subgraphUrl,
          MARKET_ANALYTICS_QUERY,
          {
            marketIds: addressesToQuery,
          }
        );

        if (cancelled) return;
        if (currentMarket?.marketId !== requestedMarketId) return;

        setAnalyticsData(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching analytics data:", error);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [subgraphUrl, currentMarket, sdk]);

  const formatAndTransform = (value: string) => {
    if (value.trim() === "") return EMPTY_VALUE;
    if (!oraclePrice) return EMPTY_VALUE;

    const bigIntValue = BigInt(value);
    const WAD = BigInt(1e18);

    const ovlValue = bigIntValue / WAD;
    const usdtValue = (ovlValue * oraclePrice) / WAD;

    return usdtValue
      .toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
      .replaceAll(",", " ");
  };

  const totalVolume = useMemo(() => {
    if (analyticsData?.markets && analyticsData.markets.length > 0) {
      const summedVolume = analyticsData.markets.reduce((acc, market) => {
        return acc + BigInt(market.totalVolume);
      }, BigInt(0));
      return formatAndTransform(summedVolume.toString());
    }

    return EMPTY_VALUE;
  }, [analyticsData?.markets, oraclePrice]);

  const totalTokensLocked = useMemo(() => {
    if (analyticsData && analyticsData.tokenPositions.length > 0) {
      const summedBalance = analyticsData.tokenPositions.reduce(
        (acc, position) => {
          return acc + BigInt(position.balance);
        },
        BigInt(0)
      );
      return formatAndTransform(summedBalance.toString());
    }

    return EMPTY_VALUE;
  }, [analyticsData?.tokenPositions, oraclePrice]);

  const totalTransactions = useMemo(() => {
    if (analyticsData?.markets && analyticsData.markets.length > 0) {
      const summedTransactions = analyticsData.markets.reduce((acc, market) => {
        return (
          acc +
          BigInt(market.numberOfBuilds) +
          BigInt(market.numberOfLiquidates) +
          BigInt(market.numberOfUnwinds)
        );
      }, BigInt(0));
      return summedTransactions
        .toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })
        .replaceAll(",", " ");
    }

    return EMPTY_VALUE;
  }, [analyticsData?.markets]);

  return {
    totalVolume,
    totalTokensLocked,
    totalTransactions,
  };
}
