import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import { formatUnits } from "viem";
import theme from "../../../../theme";
import { EvaluationPhaseStats } from "./types";
import { formatUsdt } from "./utils";
import TargetProgressBar from "./TargetProgressBar";
import { PhaseBadge } from "./funded-trader-stats-styles";

type EvaluationBarsCardProps = {
  data: EvaluationPhaseStats;
};

const EvaluationBarsCard: React.FC<EvaluationBarsCardProps> = ({ data }) => {
  const { targets, tradingDays, planName, currentValueUsdt } = data;

  const volumeCurrentNum = Number(formatUnits(BigInt(targets.volumeTarget.currentUsdt), 18));
  const volumeTargetNum = Number(formatUnits(BigInt(targets.volumeTarget.targetUsdt), 18));

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
          <PhaseBadge phase="evaluation">Evaluation</PhaseBadge>
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
        <Flex align="baseline" gap="6px">
          <Text size="4" weight="bold">
            ${formatUsdt(currentValueUsdt)}
          </Text>
          <Text
            size="1"
            weight="medium"
            style={{
              color:
                targets.profitTarget.currentPercent >= 0
                  ? theme.color.green1
                  : theme.color.red1,
            }}
          >
            {targets.profitTarget.currentPercent >= 0 ? "+" : ""}
            {targets.profitTarget.currentPercent.toFixed(1)}%
          </Text>
        </Flex>
      </Flex>

      <Flex direction="column" gap="12px" style={{ flex: 1, justifyContent: "center" }}>
        <TargetProgressBar
          label="Profit Target"
          current={targets.profitTarget.currentPercent}
          target={targets.profitTarget.targetPercent}
          unit="%"
          isNegative={targets.profitTarget.currentPercent < 0}
        />

        <TargetProgressBar
          label="Volume"
          current={volumeCurrentNum}
          target={volumeTargetNum}
          unit="USDT"
        />

        <TargetProgressBar
          label="Trading Days"
          current={targets.minTradingDays.current}
          target={targets.minTradingDays.target}
          unit="days"
        />
      </Flex>

    </Flex>
  );
};

export default EvaluationBarsCard;
