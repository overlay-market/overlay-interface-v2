import {  Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const TradeHeaderContainer = styled(Flex)`
  flex-direction: column;
  position: relative;
  margin-left: -${theme.app.mobilePadding};
  margin-right: -${theme.app.mobilePadding};
  width: calc(100% + 2 * ${theme.app.mobilePadding});
  border-top: 1px solid ${theme.color.darkBlue};
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100% + ${theme.app.rightPadding});
    margin-left: 0;
    margin-right: -${theme.app.rightPadding};
    border-top: none;
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    margin-left: -${theme.app.xxlPadding};
    margin-right: 0;
    padding-left: ${theme.app.xxlPadding};
    width: calc(100% + 2 * ${theme.app.xxlPadding});
  }
`;

export const MarketInfoContainer = styled(Flex)`
  height: 50px;
  width: 100%;
  justify-content: space-between;
  border-top: 1px solid ${theme.color.darkBlue};

  @media (min-width:  ${theme.breakpoints.sm}) {    
    height: ${theme.headerSize.height};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    justify-content: start;
    border-top: none;
  }
`;

export const StyledFlex = styled(Flex)`
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  padding-right: 12px;
  padding-left: 12px;
  border-right: 1px solid ${theme.color.darkBlue};
`;


export const BalanceFlex = styled(Flex)`
  @media (min-width: ${theme.breakpoints.lg}) {
    border-right: 1px solid ${theme.color.darkBlue};
    height: 100%;
  }
`;
