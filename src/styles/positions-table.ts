import styled from "styled-components";
import theme from "../theme";
import { focusRing } from "./shared-styles";

export const PositionsToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  padding: 8px 16px 0;
  background: #08090a;

  @media (max-width: ${theme.breakpoints.xs}) {
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 8px 12px 0;
  }
`;

export const PositionsToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.xs}) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const PositionsTitle = styled.div`
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
`;

export const PositionsFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PositionFilterChip = styled.button<{ $active?: boolean }>`
  height: 24px;
  padding: 0 10px;
  border: 1px solid
    ${({ $active }) => ($active ? theme.semantic.border : "transparent")};
  border-radius: ${theme.radius.xs};
  background: ${({ $active }) =>
    $active ? theme.semantic.hover : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  ${focusRing}

  &:hover {
    color: ${theme.semantic.textPrimary};
    background: ${theme.semantic.hover};
  }
`;

export const CloseAllButton = styled.button`
  height: 26px;
  padding: 0 12px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: 999px;
  background: ${theme.semantic.field};
  color: ${theme.semantic.accent};
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  ${focusRing}

  &:not(:disabled):hover {
    border-color: ${theme.semantic.accent};
    background: rgba(243, 169, 27, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const ContractStack = styled.div<{ $long?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-left: 8px;
  border-left: 2px solid
    ${({ $long }) => ($long === false ? theme.semantic.negative : theme.semantic.positive)};
`;

export const ContractName = styled.div`
  max-width: 150px;
  overflow: hidden;
  color: ${theme.semantic.textPrimary};
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ContractMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

export const SideBadge = styled.span<{ $long?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 5px;
  border-radius: ${theme.radius.xs};
  background: ${({ $long }) =>
    $long ? "rgba(40, 209, 154, 0.13)" : "rgba(240, 68, 94, 0.13)"};
  color: ${({ $long }) =>
    $long ? theme.semantic.positive : theme.semantic.negative};
  font-size: 10px;
  font-weight: 800;
`;

export const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 5px;
  border-radius: ${theme.radius.xs};
  background: ${theme.semantic.field};
  color: ${theme.semantic.textMuted};
  font-size: 10px;
  font-weight: 800;
`;

export const CellValue = styled.span<{ $accent?: "positive" | "negative" | "warning" }>`
  color: ${({ $accent }) => {
    if ($accent === "positive") return theme.semantic.positive;
    if ($accent === "negative") return theme.semantic.negative;
    if ($accent === "warning") return theme.semantic.warning;
    return theme.semantic.textPrimary;
  }};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const MutedCellValue = styled(CellValue)`
  color: ${theme.semantic.textMuted};
`;

export const CellStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const PositionActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const PositionActionButton = styled.button<{ $primary?: boolean }>`
  height: 24px;
  padding: 0 9px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.sm};
  background: ${({ $primary }) =>
    $primary ? "rgba(243, 169, 27, 0.14)" : theme.semantic.field};
  color: ${({ $primary }) =>
    $primary ? theme.semantic.accent : theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  ${focusRing}

  &:not(:disabled):hover {
    border-color: ${theme.semantic.accent};
    color: ${theme.semantic.textPrimary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;
