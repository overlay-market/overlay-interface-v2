import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "./theme";

export const AppContainer = styled(Flex)`
  width: 100vw;
  padding-right: ${theme.app.mobilePadding};
  padding-left: ${theme.app.mobilePadding};
  min-height: 100vh;
  background: ${theme.color.background};

  @media (pointer: coarse) {
    width: 100vw !important;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100vw - var(--scrollbar-width));
    padding-right: ${theme.app.rightPadding};
    padding-left: 0px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-right: ${theme.app.xxlPadding};
  }
`;
