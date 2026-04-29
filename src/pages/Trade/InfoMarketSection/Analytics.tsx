import { Flex } from "@radix-ui/themes";
import React from "react";
import { InfoBox, TextLabel, TextValue } from "./analytics-styles";
import { useMarketAnalytics } from "./useMarketAnalytics";

const Analytics: React.FC = () => {
  const { totalVolume, totalTokensLocked, totalTransactions } =
    useMarketAnalytics();

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
