import { Box } from "@radix-ui/themes";
import  theme  from "../../../theme";
import styled from "styled-components";

export const MarketInfo = styled.button<{ $active?: boolean }>`
  width: 100%;
  min-height: 52px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px 92px;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border: 0;
  border-left: 2px solid
    ${({ $active }) => ($active ? theme.semantic.accent : "transparent")};
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: ${({ $active }) => ($active ? "#151719" : "transparent")};
  color: ${theme.semantic.textSecondary};
  cursor: pointer;
  text-align: left;

  @media (max-width: ${theme.breakpoints.xs}) {
    grid-template-columns: minmax(0, 1fr) 76px 72px;
    gap: 8px;
    padding: 8px 12px;
  }

  &:hover {
    background: #151719;
    color: ${theme.semantic.textPrimary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

export const MarketName = styled(Box)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 800;
  line-height: 1.1;
`;

export const MarketPrice = styled(Box)`
  text-align: right;
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const MarketLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid ${theme.semantic.border};
  box-shadow: none;
`;

export const PairCell = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
`;

export const PairText = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`;

export const PairTitle = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 5px;
`;

export const LeverageBadge = styled.span`
  flex-shrink: 0;
  height: 18px;
  padding: 2px 5px;
  border-radius: ${theme.radius.xs};
  background: rgba(243, 169, 27, 0.22);
  color: ${theme.semantic.accent};
  font-size: 10px;
  font-weight: 800;
  line-height: 14px;
`;

export const TurnoverText = styled.span`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 500;
  line-height: 1.1;
`;

export const ChangeValue = styled(Box)<{ $positive?: boolean; $empty?: boolean }>`
  text-align: right;
  color: ${({ $positive, $empty }) =>
    $empty
      ? theme.semantic.textMuted
      : $positive
        ? theme.semantic.positive
        : theme.semantic.negative};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;
