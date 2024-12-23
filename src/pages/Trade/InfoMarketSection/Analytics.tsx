import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { InfoBox } from "./analytics-styles";
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

    return (bigIntValue / divisor).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
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
      return BigInt(analyticsData[0].totalTransactions).toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      );
    } else {
      return "-";
    }
  }, [analyticsData]);

  return (
    <Flex direction={"column"} gap={"16px"}>
      <InfoBox>
        <Text>Total Volume</Text>
        <Text>{totalVolume}</Text>
      </InfoBox>
      <InfoBox>
        <Text>Tokens locked</Text>
        <Text>{totalTokensLocked}</Text>
      </InfoBox>
      <InfoBox>
        <Text>Transactions</Text>
        <Text>{totalTransactions}</Text>
      </InfoBox>
    </Flex>
  );
};

export default Analytics;
