import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const MarketsContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100% - ${theme.headerSize.tabletWidth});
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: calc(${theme.app.xxlPadding} - 16px);
    padding-right: 16px;
    width: calc(100% - ${theme.app.xxlPadding} - 16px);
  }
`;

export const MarketsCarouselContainer = styled(Box)`
  width: 100%;
    
  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100vw - ${theme.headerSize.tabletWidth} - var(--scrollbar-width) - 16px);
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100vw - ${theme.headerSize.width} - var(--scrollbar-width) - 16px);
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    width: calc(100vw - ${theme.headerSize.width} - var(--scrollbar-width) - ${theme.app.xxlPadding});
  }
`;