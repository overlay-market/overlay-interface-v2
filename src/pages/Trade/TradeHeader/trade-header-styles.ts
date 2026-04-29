import { Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const TradeHeaderContainer = styled(Flex)`
  flex-direction: row;
  position: relative;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  min-height: 72px;
  box-sizing: border-box;
  background: #08090a;
  border: 1px solid ${theme.semantic.borderMuted};
  border-top: 0;
  border-radius: 0 0 ${theme.radius.md} ${theme.radius.md};
  overflow: visible;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const MarketInfoContainer = styled(Flex)`
  flex: 1 1 auto;
  min-width: 0;
  min-height: 72px;
  width: auto;
  max-width: 100%;
  justify-content: start;
  align-items: stretch;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  background: #08090a;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HeaderPriceBlock = styled.div`
  box-sizing: border-box;
  flex: 0 0 136px;
  width: 136px;
  min-width: 136px;
  max-width: 136px;
  height: 72px;
  display: flex;
  min-inline-size: 0;
  flex-direction: column;
  justify-content: center;
  padding: 0 14px;
  overflow: hidden;
  border-right: 1px solid ${theme.semantic.borderMuted};
`;

export const LastPrice = styled.div<{ $positive?: boolean }>`
  color: ${({ $positive }) =>
    $positive === false ? theme.semantic.negative : theme.semantic.positive};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PriceChange = styled.div<{ $positive?: boolean }>`
  margin-top: 5px;
  color: ${({ $positive }) =>
    $positive === false ? theme.semantic.negative : theme.semantic.positive};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderMetric = styled.div<{ $wide?: boolean }>`
  box-sizing: border-box;
  flex: 0 0 ${({ $wide }) => ($wide ? "178px" : "124px")};
  width: ${({ $wide }) => ($wide ? "178px" : "124px")};
  min-width: ${({ $wide }) => ($wide ? "178px" : "124px")};
  max-width: ${({ $wide }) => ($wide ? "178px" : "124px")};
  height: 72px;
  display: flex;
  min-inline-size: 0;
  flex-direction: column;
  justify-content: center;
  padding: 0 13px;
  overflow: hidden;
  border-right: 1px solid ${theme.semantic.borderMuted};
`;

export const MetricLabel = styled.div`
  display: block;
  width: max-content;
  max-width: 100%;
  color: ${theme.semantic.textMuted};
  border-bottom: 1px dotted #4a4f58;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetricValue = styled.div<{ $tone?: "positive" | "negative" }>`
  margin-top: 7px;
  color: ${({ $tone }) =>
    $tone === "positive"
      ? theme.semantic.positive
      : $tone === "negative"
        ? theme.semantic.negative
        : theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
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
