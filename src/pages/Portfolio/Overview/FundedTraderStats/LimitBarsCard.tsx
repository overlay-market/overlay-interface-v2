import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { FundedPhaseStats } from "./types";
import { formatUsdt } from "./utils";
import LimitProgressBar from "./LimitProgressBar";
import { PhaseBadge } from "./funded-trader-stats-styles";

type LimitBarsCardProps = {
  data: FundedPhaseStats;
};

const LimitBarsCard: React.FC<LimitBarsCardProps> = ({ data }) => {
  const { health, planName, tradingDays } = data;

  const currentValue = BigInt(health.currentValueUsdt);
  const dailyBaseline = BigInt(health.dailyBaselineUsdt);
  const initialFunding = BigInt(health.initialFundingUsdt);

  const isDailyInProfit = currentValue > dailyBaseline;
  const isMaxInProfit = currentValue > initialFunding;

  return (
    <Flex
      direction="column"
      justify="between"
      py="20px"
      px="24px"
      gap="12px"
      style={{
        backgroundColor: theme.color.grey4,
        borderRadius: "8px",
        width: "100%",
      }}
    >
      <Flex justify="between" align="center" wrap="wrap" gap="8px">
        <Flex align="center" gap="8px">
          <PhaseBadge phase="funded">Funded</PhaseBadge>
          {planName && (
            <Text size="1" style={{ color: theme.color.grey3 }}>
              {planName}
            </Text>
          )}
        </Flex>
        <Text size="1" style={{ color: theme.color.grey3 }}>
          {tradingDays} day{tradingDays !== 1 ? "s" : ""}
        </Text>
      </Flex>

      <Flex direction="column" gap="2px">
        <Text size="1" style={{ color: theme.color.grey3 }}>
          Account Value
        </Text>
        <Text size="4" weight="bold">
          ${formatUsdt(health.currentValueUsdt)}
        </Text>
      </Flex>

      <Flex direction="column" gap="12px" style={{ flex: 1, justifyContent: "center" }}>
        <LimitProgressBar
          label="Daily Loss"
          currentLossPercent={health.dailyLossLimit.currentLossPercent}
          thresholdPercent={health.dailyLossLimit.thresholdPercent}
          isInProfit={isDailyInProfit}
        />
        <LimitProgressBar
          label="Max Loss"
          currentLossPercent={health.maxLossLimit.currentLossPercent}
          thresholdPercent={health.maxLossLimit.thresholdPercent}
          isInProfit={isMaxInProfit}
        />
      </Flex>
    </Flex>
  );
};

export default LimitBarsCard;
