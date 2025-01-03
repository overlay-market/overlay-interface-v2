import { Flex } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { InfoBox, TextLabel, TextValue } from "./analytics-styles";
import { CHAIN_SUBGRAPH_URL } from "../../../constants/subgraph";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { gql, request } from "graphql-request";

const document = gql`
  query MyQuery {
    analytics_collection {
      totalTokensLocked
      totalTransactions
      totalVolume
    }
  }
`;

type AnalyticsItem = {
  totalTokensLocked: string;
  totalTransactions: string;
  totalVolume: string;
};

type AnalyticsData = AnalyticsItem[];

type MyQueryResponse = {
  analytics_collection: AnalyticsData;
};

const Analytics: React.FC = () => {
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: MyQueryResponse = await request(subgraphUrl, document);
        setAnalyticsData(data.analytics_collection);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const formatAndTransform = (value: string) => {
    if (value.trim() === "") return "-";

    const bigIntValue = BigInt(value);
    const divisor = BigInt(1e18);

    return (bigIntValue / divisor)
      .toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
      .replaceAll(",", " ");
  };

  const totalVolume = useMemo(() => {
    if (analyticsData) {
      return formatAndTransform(analyticsData[0].totalVolume);
    } else {
      return "-";
    }
  }, [analyticsData]);

  const totalTokensLocked = useMemo(() => {
    if (analyticsData) {
      return formatAndTransform(analyticsData[0].totalTokensLocked);
    } else {
      return "-";
    }
  }, [analyticsData]);

  const totalTransactions = useMemo(() => {
    if (analyticsData) {
      return BigInt(analyticsData[0].totalTransactions)
        .toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })
        .replaceAll(",", " ");
    } else {
      return "-";
    }
  }, [analyticsData]);

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
