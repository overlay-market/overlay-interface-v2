import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const TradeWidgetContainer = styled(Flex)`
  box-sizing: border-box;
  height: auto;
  min-height: 0;
  background: #08090a;
  border: 0;
  border-radius: 0;
  padding: 16px !important;
  overflow: visible;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px !important;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${theme.semantic.border} transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${theme.semantic.border};
    }
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 340px;
  }
`;

export const TradeActionGrid = styled.div<{ $single?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $single }) => ($single ? "1fr" : "1fr 1fr")};
  gap: 8px;
`;

export const TradeActionButton = styled.button<{
  $side: "long" | "short";
  $active?: boolean;
}>`
  min-height: 52px;
  border: 1px solid
    ${({ $side, $active }) =>
      $active
        ? $side === "long"
          ? theme.semantic.positive
          : theme.semantic.negative
        : theme.semantic.borderMuted};
  border-radius: ${theme.radius.sm};
  background: ${({ $side, $active }) =>
    $active
      ? $side === "long"
        ? "#083d2f"
        : theme.semantic.negativeSoft
      : theme.semantic.panelRaised};
  color: ${({ $side }) =>
    $side === "long" ? theme.semantic.positive : theme.semantic.negative};
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    opacity 0.16s ease;

  &:hover:not(:disabled) {
    border-color: ${({ $side }) =>
      $side === "long" ? theme.semantic.positive : theme.semantic.negative};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const TradeActionLabel = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.15;
`;

export const TradeActionPrice = styled.span`
  display: block;
  margin-top: 3px;
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const AdvancedSettingsButton = styled.button`
  width: 100%;
  background: transparent;
  border: 0;
  border-top: 1px solid ${theme.semantic.borderMuted};
  padding: 12px 0 0;
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.semantic.textMuted};
  cursor: pointer;
  text-align: right;

  &:hover {
    color: ${theme.semantic.accent};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const AdvancedPanel = styled(Flex)`
  background: ${theme.semantic.panelRaised};
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.sm};
  padding: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
`;
