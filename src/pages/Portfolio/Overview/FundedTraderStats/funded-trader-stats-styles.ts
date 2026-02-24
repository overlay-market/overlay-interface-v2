import styled from "styled-components";
import theme from "../../../../theme";

export const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: ${theme.color.grey4};
  border-radius: 8px;
`;

export const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PhaseBadge = styled.span<{ phase: "funded" | "evaluation" }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.color.white};
  background: ${({ phase }) =>
    phase === "funded"
      ? `linear-gradient(135deg, ${theme.color.green1} 0%, #4ade80 100%)`
      : `linear-gradient(135deg, ${theme.color.yellow1} 0%, #ffb347 100%)`};
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
`;

export const ProgressBarLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: ${theme.color.grey3};
  gap: 8px;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${theme.color.grey6};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${({ width }) => `${Math.min(Math.max(width, 0), 100)}%`};
  background-color: ${({ color }) => color};
  border-radius: 4px;
  transition: width 0.5s ease, background-color 0.3s ease;
`;

export const ProgressValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.color.white};
  white-space: nowrap;
`;

export const CheckMark = styled.span`
  color: ${theme.color.green1};
  font-weight: 700;
  margin-left: 6px;
`;

export const ReadyBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    ${theme.color.green1} 0%,
    #4ade80 100%
  );
  color: ${theme.color.black};
  font-weight: 700;
  font-size: 14px;
`;
