import React from "react";
import theme from "../../../../theme";
import {
  ProgressBarContainer,
  ProgressBarLabel,
  ProgressTrack,
  ProgressFill,
  ProgressValue,
  CheckMark,
} from "./funded-trader-stats-styles";

type TargetProgressBarProps = {
  label: string;
  current: number;
  target: number;
  unit?: string;
  isNegative?: boolean;
};

const TargetProgressBar: React.FC<TargetProgressBarProps> = ({
  label,
  current,
  target,
  unit = "",
  isNegative = false,
}) => {
  const isMet = current >= target;
  const ratio = target > 0 ? (Math.max(current, 0) / target) * 100 : 0;
  const color = isMet ? theme.color.green1 : theme.color.blue3;
  const valueColor = isNegative
    ? theme.color.red1
    : isMet
      ? theme.color.green1
      : theme.color.white;

  const suffix = unit ? ` ${unit}` : "";

  return (
    <ProgressBarContainer>
      <ProgressBarLabel>
        <span>
          {label}
          {isMet && <CheckMark>&#10003;</CheckMark>}
        </span>
        <ProgressValue style={{ color: valueColor }}>
          {current}
          {suffix} / {target}
          {suffix}
        </ProgressValue>
      </ProgressBarLabel>
      <ProgressTrack>
        <ProgressFill width={ratio} color={color} />
      </ProgressTrack>
    </ProgressBarContainer>
  );
};

export default TargetProgressBar;
