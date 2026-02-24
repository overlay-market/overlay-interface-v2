import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { EvaluationPhaseStats } from "./types";
import { formatUsdt, isAllTargetsMet } from "./utils";
import {
  StatsSection,
  StatsHeader,
  HeaderLeft,
  PhaseBadge,
  ReadyBanner,
} from "./funded-trader-stats-styles";
import TargetProgressBar from "./TargetProgressBar";

type EvaluationPhaseOverviewProps = {
  data: EvaluationPhaseStats;
};

const EvaluationPhaseOverview: React.FC<EvaluationPhaseOverviewProps> = ({
  data,
}) => {
  const { targets, tradingDays, planName, currentValueUsdt } = data;
  const allMet = isAllTargetsMet(targets);

  const volumeCurrent = formatUsdt(targets.volumeTarget.currentUsdt, 0);
  const volumeTarget = formatUsdt(targets.volumeTarget.targetUsdt, 0);

  return (
    <StatsSection>
      <StatsHeader>
        <HeaderLeft>
          <PhaseBadge phase="evaluation">Evaluation</PhaseBadge>
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
        <Flex align="baseline" gap="8px">
          <Text size="5" weight="bold">
            ${formatUsdt(currentValueUsdt)}
          </Text>
          <Text
            size="2"
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

      <Flex direction="column" gap="12px">
        <TargetProgressBar
          label="Profit Target"
          current={targets.profitTarget.currentPercent}
          target={targets.profitTarget.targetPercent}
          unit="%"
          isNegative={targets.profitTarget.currentPercent < 0}
        />

        <TargetProgressBar
          label="Volume Target"
          current={Number(volumeCurrent.replace(/,/g, ""))}
          target={Number(volumeTarget.replace(/,/g, ""))}
          unit="USDT"
        />

        <TargetProgressBar
          label="Min Trading Days"
          current={targets.minTradingDays.current}
          target={targets.minTradingDays.target}
          unit="days"
        />
      </Flex>

      {allMet && <ReadyBanner>Ready for Funding</ReadyBanner>}
    </StatsSection>
  );
};

export default EvaluationPhaseOverview;
