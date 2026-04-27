import { Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const TradeHeaderContainer = styled(Flex)`
  flex-direction: column;
  position: relative;
  min-width: 0;
  width: 100%;
  background: #08090a;

  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row;
    height: 64px;
  }
`;

export const MarketInfoContainer = styled(Flex)`
  min-height: 64px;
  width: 100%;
  justify-content: start;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    overflow: hidden;
  }
`;

export const StyledFlex = styled(Flex)`
  min-width: 122px;
  height: 64px;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 0 14px;
  border-right: 1px solid ${theme.semantic.borderMuted};
  color: ${theme.semantic.textSecondary};

  span:first-child {
    color: ${theme.semantic.textMuted};
    font-size: 11px !important;
    line-height: 1.1;
  }

  span:last-child {
    color: ${theme.semantic.textPrimary};
    font-size: 14px;
    font-weight: 700;
    line-height: 1.1;
  }
`;

export const BalanceFlex = styled(Flex)`
  min-width: 204px;
  border-right: 1px solid ${theme.semantic.borderMuted};
`;
