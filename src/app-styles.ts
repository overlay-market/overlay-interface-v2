import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "./theme";
import { css } from "@emotion/react";

export const globalScrollbarStyles = css`
  body {
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const AppContainer = styled(Flex)`
  width: calc(100vw);
  padding-right: 12px;
  padding-left: 12px;
  min-height: 100vh;
  background: ${theme.color.background};

  @media (pointer: coarse) {
    width: 100vw !important;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100vw - 16px);
    padding-right: 0px;
    padding-left: 0px;
  }
`;
