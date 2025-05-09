import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";
import beraBalloonsImgUrl from '../../assets/images/bera-markets-page/beraBalloons.webp';
import bgLandUrl from '../../assets/images/bera-markets-page/land.webp';
import beraCloudUrl from '../../assets/images/bera-markets-page/beracloud.webp';
import beraTreesUrl from '../../assets/images/bera-markets-page/trees.webp'

export const BeraMarketsWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: start;
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

export const BeraMarketsContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  
  background-image: url(${beraTreesUrl}), url(${bgLandUrl}) ;
  background-size: 94px, 100%; 
  background-position: bottom 73px right 7%, bottom 73px left 0px;
  background-repeat: no-repeat, no-repeat;

  @media (min-width: ${theme.breakpoints.sm}) { 
    min-height: calc(100vh - ${theme.headerSize.height});
    height: calc(100vh - ${theme.headerSize.height});
    background-size: 171px, 100% 72px; 
    background-position: bottom 6px right 10%, bottom 0px left 0px;
    overflow-x: hidden;
  }
  
  @media (min-width: ${theme.breakpoints.lg}) { 
    align-items: start;   
    padding: 0 0 0 60px;
    background-size: 294px, 100% 115px; 
    background-position: bottom -6px right 7%, bottom 0px left 0px;
  }  
`

export const BeraMarketsContent = styled(Flex)`
  flex-direction: column;
  align-items: start;
  gap: 8px;
  padding: 16px 16px 170px;
  position: relative;
  z-index: 2;
  
  @media (min-width: ${theme.breakpoints.sm}) {    
    padding: 80px 22px 80px;
  } 

  @media (min-width: ${theme.breakpoints.lg}) {    
    padding: 180px 0px 140px;
  }  
`

export const MarketsText = styled(Text)`
  font-size: 32px;
  font-family: Lacquer;
  font-weight: 400;  
  letter-spacing: -1px;
`

export const BeraCloudImg = styled(Flex)`
  position: absolute;
  top: -45px;
  right: 18px;
  width: 95px;
  height: 95px;
  z-index: 10; 
  background-image: url(${beraCloudUrl});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    width: 157px;
    height: 157px;
    top: -6px;
    right: calc(50% - 320px);
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    top: 42px;
    left: 720px;
  }
`

export const BottomRightBeraBalloonsImg = styled(Flex)`
  position: absolute;
  bottom: 45px;
  right: calc(50% - 66px);
  transform: rotate(-21deg) scaleX(-1);
  width: 77px;
  height: 140px;
  z-index: 1; 
  background-image: url(${beraBalloonsImgUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (min-width: ${theme.breakpoints.sm}) {    
    top: 400px;
    right: 30px;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    top: 80px;
    left: 960px;
    width: 107px;
    height: 195px;     
  }
` 