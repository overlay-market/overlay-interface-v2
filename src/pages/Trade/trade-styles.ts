import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const TradeContainer = styled(Flex)`
  min-height: calc(100vh - ${theme.headerSize.height});
  gap: 0;
  color: ${theme.semantic.textPrimary};
  background: #050607;
`;

export const TradeShell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
`;

export const TradeMarketBar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 64px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #08090a;
  overflow: visible;

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: 72px;
  }
`;

export const TradeGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "chart"
    "ticket"
    "positions";
  min-height: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-areas:
      "chart"
      "ticket"
      "book"
      "positions";
  }

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr) 320px;
    grid-template-areas:
      "chart ticket"
      "book ticket"
      "positions positions";
  }

  @media (min-width: 1100px) {
    grid-template-columns: minmax(560px, 1fr) 266px 320px;
    grid-template-rows: minmax(564px, calc(100vh - 330px)) 158px;
    grid-template-areas:
      "chart book ticket"
      "positions positions positions";
  }

  @media (min-width: 1500px) {
    grid-template-columns: minmax(720px, 1fr) 280px 340px;
  }
`;

export const ChartRegion = styled.div`
  grid-area: chart;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: clamp(364px, 50vh, 430px);
  overflow: hidden;
  background: #08090a;
  border-right: 1px solid ${theme.semantic.borderMuted};
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  @media (min-width: ${theme.breakpoints.md}) {
    min-height: 564px;
  }
`;

export const OrderBookRegion = styled.div`
  grid-area: book;
  display: none;
  min-width: 0;
  min-height: 340px;
  border-right: 1px solid ${theme.semantic.borderMuted};
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  @media (min-width: ${theme.breakpoints.sm}) {
    display: block;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    min-height: 420px;
  }
`;

export const TicketRegion = styled.div`
  grid-area: ticket;
  min-width: 0;
  min-height: 0;
  overflow: visible;
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  @media (min-width: ${theme.breakpoints.md}) {
    min-height: 520px;
    overflow: hidden;
  }
`;

export const PositionsRegion = styled.div`
  grid-area: positions;
  min-width: 0;
  min-height: 150px;
  border-right: 1px solid ${theme.semantic.borderMuted};
  border-bottom: 1px solid ${theme.semantic.borderMuted};
`;

export const BottomTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 38px;
  padding: 0 12px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #08090a;
  overflow-x: auto;

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: 24px;
    padding: 0 16px;
  }
`;

export const BottomTab = styled.button<{ $active?: boolean }>`
  height: 38px;
  padding: 0;
  border: 0;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? theme.semantic.textPrimary : "transparent")};
  background: transparent;
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${theme.semantic.textPrimary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const PositionsTabPanel = styled.div`
  min-width: 0;

  &[hidden] {
    display: none;
  }
`;
