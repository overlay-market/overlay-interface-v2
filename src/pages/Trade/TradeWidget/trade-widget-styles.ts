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

export const TicketMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
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
