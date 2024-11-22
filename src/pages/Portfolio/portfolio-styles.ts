import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const HeaderEmptyPlaceholder = styled(Box)`
  height: 0;
  margin: 0 15px;
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 100%;
    margin: 0;
    height: ${theme.headerSize.height};
  }
  
  @media (min-width: ${theme.breakpoints.xxl}) {
    border-bottom: none;
  }
`;

export const PortfolioContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    margin-left: 60px;
    margin-right: 60px;
  }
`

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 0;
    width: calc(100vw - ${theme.headerSize.width});
    position: absolute;
    top: ${theme.headerSize.height};
    margin-left: -60px;
    margin-right: -60px;
    border-bottom: 1px solid ${theme.color.darkBlue};
  }
`