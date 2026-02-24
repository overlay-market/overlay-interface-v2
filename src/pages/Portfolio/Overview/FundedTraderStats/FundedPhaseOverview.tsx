import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { FundedPhaseStats } from "./types";
import { formatUsdt } from "./utils";
import {
  StatsSection,
  StatsHeader,
  HeaderLeft,
  PhaseBadge,
} from "./funded-trader-stats-styles";

type FundedPhaseOverviewProps = {
  data: FundedPhaseStats;
};

const FundedPhaseOverview: React.FC<FundedPhaseOverviewProps> = ({ data }) => {
  const { health, tradingDays, planName } = data;

  return (
    <StatsSection>
      <StatsHeader>
        <HeaderLeft>
          <PhaseBadge phase="funded">Funded</PhaseBadge>
          {planName && (
            <Text size="2" weight="medium" style={{ color: theme.color.white }}>
              {planName}
            </Text>
          )}
        </HeaderLeft>
        <Text size="2" style={{ color: theme.color.grey3 }}>
          {tradingDays} trading day{tradingDays !== 1 ? "s" : ""}
        </Text>
      </StatsHeader>

      <Flex direction="column" gap="4px">
        <Text size="1" style={{ color: theme.color.grey3 }}>
          Account Value
        </Text>
        <Text size="5" weight="bold">
          ${formatUsdt(health.currentValueUsdt)}
        </Text>
      </Flex>
    </StatsSection>
  );
};

export default FundedPhaseOverview;
