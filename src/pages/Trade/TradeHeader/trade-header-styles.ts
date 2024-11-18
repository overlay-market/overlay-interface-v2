import {  Box, Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const ResponsiveEmptyPlaceholder = styled(Box)`
  height: 0;
  margin: 0 15px;
  border-bottom: 1px solid ${theme.color.darkBlue};
`;

export const TradeHeaderContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
  position: relative;
    
  @media (min-width: ${theme.breakpoints.sm}) {
    border-bottom: 1px solid ${theme.color.darkBlue};
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    border-bottom: none;
  }
`;

export const MarketInfoContainer = styled(Flex)`
  height: 50px;
  width: 100%;
  justify-content: space-between;
 
  @media (min-width:  ${theme.breakpoints.sm}) {    
    height: ${theme.headerSize.height};
    border-top: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    justify-content: start;
  }
`;

export const StyledFlex = styled(Flex)`
  height: 100%;
  flex-direction: column;

  @media (min-width: ${theme.breakpoints.sm}) {
    border-right: 1px solid ${theme.color.darkBlue};
  }
`;