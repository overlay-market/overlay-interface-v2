import {  Box, Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const ResponsiveEmptyPlaceholder = styled(Box)`
  height: 0;
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 100%;
    height: ${theme.headerSize.height};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: 1120px) {
    height: 0;
  }
`;

export const TradeHeaderContainer = styled(Flex)`
  border-bottom: 1px solid ${theme.color.darkBlue};
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: start;
  text-align: end;
  position: relative;
  
  @media (min-width: 680px) {
    height: ${theme.headerSize.height};
    flex-direction: row;
  }
`;

export const MarketInfoContainer = styled(Flex)`
  flex-direction: column;  
  height: auto;
  width: 100%;
  border-top: 1px solid ${theme.color.darkBlue};

  @media (min-width: 440px) {
    height: auto;
    flex-direction: row;
    
  }

  @media (min-width: 680px) {    
    border-top: none;
    height: ${theme.headerSize.height};
  }
`;

export const StyledFlex = styled(Flex)`
  height: 60px;
  width: 100%;
  border-top: 1px solid ${theme.color.darkBlue};

  @media (min-width: 440px) {
    height: auto;
    border-top: none;
  }

  @media (min-width: 680px) {
    flex-direction: row;    
  }
`;

