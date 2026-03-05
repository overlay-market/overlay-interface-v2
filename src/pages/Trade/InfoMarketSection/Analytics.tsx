import { Flex } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { InfoBox, TextLabel, TextValue } from "./analytics-styles";
import { CHAIN_SUBGRAPH_URL } from "../../../constants/subgraph";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { gql, request } from "graphql-request";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const document = gql`
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

const Analytics: React.FC = () => {
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
      if (!currentMarket) return;

      try {
        // Get all market details for this chain (including deprecated) with caching
        const marketsDetailsMap = await sdk.markets.getAllMarketsDetails();

        // Filter to get all deployment addresses for the same marketId
        const marketAddresses = Array.from(marketsDetailsMap.values())
          .filter((market) => market.marketId === requestedMarketId)
          .map((market) => market.id.toLowerCase());

        // If no addresses found, fallback to current market only (normalized)
        const addressesToQuery =
          marketAddresses.length > 0
            ? marketAddresses
            : [currentMarket.id.toLowerCase()];

        // Query subgraph for all market addresses
        const data: AnalyticsData = await request(subgraphUrl, document, {
          marketIds: addressesToQuery,
        });

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
    if (value.trim() === "") return " ";
    if (!oraclePrice) return " ";

    const bigIntValue = BigInt(value);
    const WAD = BigInt(1e18);

    // Convert OVL to USDT: (ovlValue * oraclePrice) / WAD
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
      // Sum total volume across all markets
      const summedVolume = analyticsData.markets.reduce((acc, market) => {
        return acc + BigInt(market.totalVolume);
      }, BigInt(0));
      return formatAndTransform(summedVolume.toString());
    } else {
      return " ";
    }
  }, [analyticsData?.markets, oraclePrice]);

  const totalTokensLocked = useMemo(() => {
    if (analyticsData && analyticsData.tokenPositions.length > 0) {
      // Sum balance across all token positions
      const summedBalance = analyticsData.tokenPositions.reduce(
        (acc, position) => {
          return acc + BigInt(position.balance);
        },
        BigInt(0)
      );
      return formatAndTransform(summedBalance.toString());
    } else {
      return " ";
    }
  }, [analyticsData?.tokenPositions, oraclePrice]);

  const totalTransactions = useMemo(() => {
    if (analyticsData?.markets && analyticsData.markets.length > 0) {
      // Sum transactions across all markets
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
    } else {
      return " ";
    }
  }, [analyticsData?.markets]);

  return (
    <Flex direction={"column"} gap={"16px"} style={{ flex: 1 }}>
      <InfoBox>
        <TextLabel>Total Volume</TextLabel>
        <TextValue>{totalVolume}</TextValue>
      </InfoBox>
      <InfoBox>
        <TextLabel>Tokens locked</TextLabel>
        <TextValue>{totalTokensLocked}</TextValue>
      </InfoBox>
      <InfoBox>
        <TextLabel>Transactions</TextLabel>
        <TextValue>{totalTransactions}</TextValue>
      </InfoBox>
    </Flex>
  );
};

export default Analytics;
