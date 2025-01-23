import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";
import mainBg from "../../../assets/images/airdrops/main-bg.png";
import handImgUrl from '../../../assets/images/airdrops/hand.png';
import catImgUrl from '../../../assets/images/airdrops/cat.png';
import calloutTopUrl from '../../../assets/images/airdrops/callout-top.png';
import calloutTopDesktopUrl from '../../../assets/images/airdrops/callout-top-desktop.png';
import calloutBottomRightUrl from '../../../assets/images/airdrops/callout-bottom-right.png';
import calloutBottomLeftUrl from '../../../assets/images/airdrops/callout-bottom-left.png';

export const AirdropsClaimWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {    
    margin-right: -40px;
  } 
`

export const AirdropsClaimContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {    
    height: calc(100% - ${theme.headerSize.height})
  } 
  @media (min-width: ${theme.breakpoints.lg}) {    
    height: 100%;  
  }  
`

export const MainBgImg = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; 
  background-image: url(${mainBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.6;
  mix-blend-mode: luminosity; 
` 

export const HandImg = styled(Flex)`
  position: absolute;
  top: -11px;
  left: -40px;
  width: 196px;
  height: 196px;
  z-index: 20; 
  background-image: url(${handImgUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    top: -10px;
    left: -80px;
    width: 320px;
    height: 320px;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {    
    top: -28px;
    left: calc(50% - 330px);
  }
` 

export const CalloutTopImg = styled(Flex)`
  position: absolute;
  top: 10px;
  left: 175px;
  width: 176px;
  height: 88px;
  z-index: 20; 
  background-image: url(${calloutTopUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
 
  @media (min-width: ${theme.breakpoints.sm}) {    
    top: 10px;
    left: 200px;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {    
    top: 20px;
    left: calc(50% - 330px - 210px);
    width: 188px;
    height: 166px;
    background-image: url(${calloutTopDesktopUrl});
  }
` 

export const CalloutBottomImg = styled(Flex)`
  position: absolute;
  bottom: 140px;
  left: calc(50% - 180px);
  width: 149px;
  height: 74px;
  z-index: 20; 
  background-image: url(${calloutBottomLeftUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (min-width: ${theme.breakpoints.sm}) {    
    bottom: 96px;
    left: calc(60% - 198px);
  } 

  @media (min-width: ${theme.breakpoints.lg}) {    
    bottom: 66px;
    left: calc(50% - 190px + 535px - 80px);
    width: 226px;
    height: 112px;
    background-image: url(${calloutBottomRightUrl});
  }  
` 

export const CatImg = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: calc(50% - 140px);
  width: 335px;
  height: 287px;
  z-index: 200; 
  background-image: url(${catImgUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (min-width: ${theme.breakpoints.sm}) {    
    bottom: -180px;
    left: calc(60% - 200px);
    width: 535px;
    height: 459px;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {    
    bottom: -205px;
    left: calc(50% - 190px);
  }
` 

export const ArcTopImg = styled(Flex)`
  @media (min-width: ${theme.breakpoints.lg}) {    
    position: absolute;
    top: -310px;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 790px;
    height: 523px;
    z-index: 0;
    border: 1px solid white;
    border-radius: 140px; 
    opacity: 0.6;
  }
` 

export const ArcBottomImg = styled(Flex)`
  @media (min-width: ${theme.breakpoints.lg}) {    
    position: absolute;
    bottom: -310px;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 790px;
    height: 523px;
    z-index: 0;
    border: 1px solid white;
    border-radius: 140px; 
    opacity: 0.6;
  }
` 

export const AirdropsClaimContent = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 343px;
  padding: 24px 16px 16px;
  gap: 16px;
  position: relative;
  z-index: 50;  
  background: transparent;
  
  @media (min-width: ${theme.breakpoints.sm}) {    
    width: 580px;
    border: solid 1px #AAAAAA; 
    border-radius: 16px;
    background: #0B0F1C;
    box-shadow: 0px 0px 220px 0px rgba(255, 124, 213, 0.6), 0px 0px 4px 0px rgba(255, 255, 255, 0.7) inset;
  } 
  @media (min-width: ${theme.breakpoints.lg}) {    
    width: 640px;
  }  
`

export const GradientBorderBox = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  gap: 8px;
  border: solid 1px transparent; 
  border-radius: 16px;
  background: linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
    linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;  
  box-shadow: 0px 0px 220px 0px rgba(255, 124, 213, 0.6);

  @media (min-width: ${theme.breakpoints.sm}) {    
    box-shadow: 0px 0px 12px 3px rgba(255, 255, 255, 0.45);
  }  
`;

export const GradientText = styled(Text)`
  font-size: 28px;
  font-family: Roboto Mono;
  line-height: 37px;
  width: fit-content;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;

  @media (min-width: ${theme.breakpoints.sm}) {    
    font-size: 40px;
    line-height: 52px;
  }  
`;
