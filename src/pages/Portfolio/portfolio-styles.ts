import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const HeaderEmptyPlaceholder = styled(Box)`
  height: 0;
  margin: 0 3px;
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 100%;
    margin: 0;
    height: ${theme.headerSize.height};
    border-bottom: none;
  }
`;

export const PortfolioContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: 60px;
    padding-right: 60px;
  }
`

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
   
  }
`