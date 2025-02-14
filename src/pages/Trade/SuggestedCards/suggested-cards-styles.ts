import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const SuggestedCardsContainer = styled(Flex)`
  width: 100%;
  padding-bottom: 66px;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100vw - ${theme.headerSize.tabletWidth} - var(--scrollbar-width));
    padding-left: 8px;
    margin-right: -${theme.app.rightPadding};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100vw - ${theme.headerSize.width} - var(--scrollbar-width));
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    margin-right: -${theme.app.xxlPadding};
    padding-left: 0;
    width: calc(100vw - ${theme.headerSize.width} - var(--scrollbar-width) - ${theme.app.xxlPadding});
  }
`;