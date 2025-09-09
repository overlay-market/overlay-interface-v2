import { Flex } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { InfoBox, TextLabel, TextValue } from "./analytics-styles";
import { CHAIN_SUBGRAPH_URL } from "../../../constants/subgraph";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { gql, request } from "graphql-request";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const document = gql`
  query MyQuery($marketId: String!) {
    market(id: $marketId) {
      totalVolume
      numberOfBuilds
      numberOfUnwinds
      numberOfLiquidates
    }
    tokenPositions(where: { owner: $marketId }) {
      balance
    }
  }
`;

type MarketData = {
  totalVolume: string;
  numberOfBuilds: string;
  numberOfUnwinds: string;
  numberOfLiquidates: string;
} | null;

type BalanceData = {
  balance: string;
};

type AnalyticsData = {
  market: MarketData;
  tokenPositions: BalanceData[];
};

const Analytics: React.FC = () => {
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];
  const { currentMarket } = useCurrentMarketState();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (currentMarket) {
        try {
          const data: AnalyticsData = await request(subgraphUrl, document, {
            marketId: currentMarket.id,
          });
          setAnalyticsData(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [subgraphUrl, currentMarket]);

  const formatAndTransform = (value: string) => {
    if (value.trim() === "") return " ";

    const bigIntValue = BigInt(value);
    const divisor = BigInt(1e18);
    const formattedValue = bigIntValue / divisor;

    return formattedValue
      .toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
      .replaceAll(",", " ");
  };

  const totalVolume = useMemo(() => {
    if (analyticsData?.market) {
      return formatAndTransform(analyticsData.market.totalVolume);
    } else {
      return " ";
    }
  }, [analyticsData?.market]);

  const totalTokensLocked = useMemo(() => {
    if (analyticsData && analyticsData.tokenPositions.length > 0) {
      return formatAndTransform(analyticsData.tokenPositions[0].balance);
    } else {
      return " ";
    }
  }, [analyticsData?.tokenPositions]);

  const totalTransactions = useMemo(() => {
    if (analyticsData?.market) {
      return (
        BigInt(analyticsData.market.numberOfBuilds) +
        BigInt(analyticsData.market.numberOfLiquidates) +
        BigInt(analyticsData.market.numberOfUnwinds)
      )
        .toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })
        .replaceAll(",", " ");
    } else {
      return " ";
    }
  }, [analyticsData?.market]);

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
