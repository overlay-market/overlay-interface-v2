import {  Box, Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const ResponsiveEmptyPlaceholder = styled(Box)`
  height: 0;
  margin: 0 4px;
  border-bottom: 1px solid ${theme.color.darkBlue};
`;

export const TradeHeaderContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
  position: relative;
    
  @media (min-width: ${theme.breakpoints.sm}) {
    border-bottom: none;
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

export const MarketInfoContainer = styled(Flex)`
  height: 50px;
  width: 100%;
  justify-content: space-between;
 
  @media (min-width:  ${theme.breakpoints.sm}) {    
    height: ${theme.headerSize.height};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    justify-content: start;
  }
`;

export const StyledFlex = styled(Flex)`
  height: 100%;
  flex-direction: column;
  align-items: end;

  @media (min-width: ${theme.breakpoints.sm}) {
    border-right: 1px solid ${theme.color.darkBlue};
  }
`;


export const BalanceFlex = styled(Flex)`
  @media (min-width: ${theme.breakpoints.lg}) {
    border-right: 1px solid ${theme.color.darkBlue};
    height: 100%;
  }
`;


export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: calc(${theme.headerSize.height} * 2);
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    border-bottom: none;
  }
`