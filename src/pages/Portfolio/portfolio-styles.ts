import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const HeaderEmptyPlaceholder = styled(Box)`
  @media (min-width: ${theme.breakpoints.sm}) {
    width: 100%;
    height: ${theme.headerSize.height};
  }
`;

export const PortfolioContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100% - ${theme.headerSize.tabletWidth});
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: ${theme.app.xxlPadding};
    width: calc(100% - ${theme.app.xxlPadding});
  }
`;

export const LineSeparator = styled(Flex)`
  height: 0;
  margin-left: -${theme.app.mobilePadding};
  margin-right: -${theme.app.mobilePadding};
  width: calc(100% + 2 * ${theme.app.mobilePadding});
  border-bottom: 1px solid ${theme.color.darkBlue};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    margin: 0;
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
  }
`;
