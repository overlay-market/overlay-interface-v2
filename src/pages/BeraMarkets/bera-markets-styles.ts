import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const BeraMarketsWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: -${theme.app.mobilePadding};
  margin-right: -${theme.app.mobilePadding};
  width: calc(100% + 2 * ${theme.app.mobilePadding});
  height: 100%;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {    
    margin-right: -${theme.app.rightPadding};
    width: calc(100% + ${theme.app.rightPadding});
    margin-left: 0;
  } 

  @media (min-width: ${theme.breakpoints.xxl}) {    
    margin-right: -${theme.app.xxlPadding};
    width: calc(100% + ${theme.app.xxlPadding});
  } 
`

export const BeraMarketsContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
  width: 100%;
  height: 100%;
  background: #2986CB;
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) { 
    height: calc(100% - ${theme.headerSize.height})
  } 
`

export const BeraMarketsContent = styled(Flex)`
  flex-direction: column;
  align-items: start;
  width: 100%;
  gap: 12px;
  margin-top: 28px;
  margin-bottom: 240px;
  padding: 0px 16px;
  
  @media (min-width: ${theme.breakpoints.sm}) {    
    max-width: 956px;
    gap: 20px;
    padding: 0px 32px;
    margin-top: 80px;
    margin-bottom: 200px;
  } 
  @media (min-width: ${theme.breakpoints.lg}) {    
    margin-top: 180px;
  }  
`

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: 100%;
    position: absolute;
    top: ${theme.headerSize.height};
    left: 0;
    border-bottom: 1px solid ${theme.color.darkBlue};
  }
`

export const Title = styled(Text)`
  font-size: 24px;
  font-weight: 600;  
  text-shadow: 
  -0.5px -0.5px 0 rgba(0, 0, 0, 0.5), 
  0.5px -0.5px 0 rgba(0, 0, 0, 0.5), 
  -0.5px  0.5px 0 rgba(0, 0, 0, 0.5), 
  0.5px  0.5px 0 rgba(0, 0, 0, 0.5);

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 32px;
    font-weight: 700;
    text-shadow: none;
  }
`