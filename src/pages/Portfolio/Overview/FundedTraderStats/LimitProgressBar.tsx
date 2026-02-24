import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import {
  ProgressBarContainer,
  ProgressTrack,
  ProgressFill,
} from "./funded-trader-stats-styles";
import { getHealthColor } from "./utils";

type LimitProgressBarProps = {
  label: string;
  currentLossPercent: number;
  thresholdPercent: number;
  isInProfit: boolean;
};

const LimitProgressBar: React.FC<LimitProgressBarProps> = ({
  label,
  currentLossPercent,
  thresholdPercent,
  isInProfit,
}) => {
  // healthPct: 100% = untouched, 0% = killed. Matches the bar fill exactly.
  const healthPct = isInProfit
    ? 100
    : ((thresholdPercent - currentLossPercent) / thresholdPercent) * 100;
  const color = getHealthColor(healthPct, isInProfit);

  return (
    <ProgressBarContainer>
      <Flex justify="between" align="baseline">
        <Text size="1" style={{ color: theme.color.grey3 }}>
          {label}
        </Text>
        <Text size="3" weight="bold" style={{ color }}>
          {isInProfit ? "Safe" : `${healthPct.toFixed(1)}%`}
        </Text>
      </Flex>

      <ProgressTrack>
        <ProgressFill width={healthPct} color={color} />
      </ProgressTrack>

      <Text style={{ fontSize: "11px", color: theme.color.grey10 }}>
        {isInProfit
          ? "In profit — no loss from baseline"
          : `${currentLossPercent.toFixed(2)}% lost of ${thresholdPercent}% limit`}
      </Text>
    </ProgressBarContainer>
  );
};

export default LimitProgressBar;
