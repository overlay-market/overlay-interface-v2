import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";
import beraBalloonsImgUrl from '../../assets/images/bera-markets-page/beraBalloons.webp';
import bgBeraBalloonsUrl from '../../assets/images/bera-markets-page/bgBeraBalloons.webp';
import beraCloud1Url from '../../assets/images/bera-markets-page/beraCloud1.webp';
import beraCloud2Url from '../../assets/images/bera-markets-page/beraCloud2.webp';
import beraCloud3Url from '../../assets/images/bera-markets-page/beraCloud3.webp';
import beraCloud4Url from '../../assets/images/bera-markets-page/beraCloud4.webp';



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

export const BeraMarketsContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
  width: 100%;
  height: 100%;
  background: #2986CB;
  box-sizing: border-box;
  overflow-x: hidden;

  background-image: url(${bgBeraBalloonsUrl});
  background-size: auto; 
  background-position: bottom 6px left -50px;
  background-repeat: no-repeat;

  @media (max-width: 480px) {
    background-size: 420px; 
  }

  @media (min-width: 481px) {
    background-size: 460px; 
    background-position: bottom -10px left -10px;
  }

  @media (min-width: ${theme.breakpoints.sm}) { 
    min-height: calc(100vh - ${theme.headerSize.height});
    height: calc(100vh - ${theme.headerSize.height});
    background-size: 720px; 
    background-position: bottom -110px left 22px;
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {    
    padding: 180px auto 140px;
    background-size: 1030px; 
    background-position: bottom -220px left 50%;
  }  
`

export const BeraMarketsContent = styled(Flex)`
  flex-direction: column;
  align-items: start;
  gap: 12px;
  padding: 28px 16px 170px;
  position: relative;
  z-index: 2;
  
  @media (min-width: ${theme.breakpoints.sm}) {    
    gap: 20px;
    padding: 80px 22px 260px;
  } 

  @media (min-width: ${theme.breakpoints.lg}) {    
    padding: 180px 0px 140px;
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
    letter-spacing: -1.8px;
  }
`

export const TopLeftBeraBalloonsImg = styled(Flex)`
  position: absolute;
  top: 52px;
  left: 3px;
  transform: rotate(21deg);
  width: 80px;
  height: 146px;
  z-index: 20; 
  background-image: url(${beraBalloonsImgUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    display: none;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    display: flex; 
    top: 18px;
    left: 36px;
    width: 147px;
    height: 268px;
     
  }
` 

export const BeraCloud1Img = styled(Flex)`
  position: absolute;
  top: 18px;
  left: -22px;
  width: 104px;
  height: 55px;
  z-index: 1; 
  background-image: url(${beraCloud1Url});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    width: 126px;
    height: 66px;
    top: 18px;
    left: 28px;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    top: 64px;
    left: 180px;
    width: 219px;
    height: 116px;     
  }
`

export const BeraCloud2Img = styled(Flex)`
  position: absolute;
  top: 17px;
  right: 18px;
  width: 117px;
  height: 62px;
  z-index: 1; 
  background-image: url(${beraCloud2Url});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    width: 89px;
    height: 47px;
    top: 32px;
    left: 42%;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    top: 42px;
    left: 38%;
    width: 155px;
    height: 82px;     
  }
`

export const BeraCloud3Img = styled(Flex)`
  position: absolute;
  
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    top: 22px;
    right: 18px;
    width: 90px;
    height: 59px;
    z-index: 1; 
    background-image: url(${beraCloud3Url});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    top: 22px;
    right: 32px;
    width: 157px;
    height: 103px;     
  }
`

export const BeraCloud4Img = styled(Flex)`
  position: absolute;
  top: 98px;
  right: -100px;
  width: 174px;
  height: 59px;
  z-index: 1; 
  background-image: url(${beraCloud4Url});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
   
  @media (min-width: ${theme.breakpoints.sm}) {    
    width: 132px;
    height: 45px;
    top: 66px;
    right: 21%;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    top: 92px;
    right: 22%;
    width: 230px;
    height: 78px;     
  }
`

export const BottomRightBeraBalloonsImg = styled(Flex)`
  position: absolute;
  bottom: 36px;
  right: 6px;
  transform: rotate(-21deg) scaleX(-1);
  width: 80px;
  height: 146px;
  z-index: 10; 
  background-image: url(${beraBalloonsImgUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (min-width: ${theme.breakpoints.sm}) {    
    bottom: -10px;
    right: -6px;
    width: 161px;
    height: 294px;
  }  

  @media (min-width: ${theme.breakpoints.lg}) {   
    bottom: -12px;
    right: -6px;
    width: 147px;
    height: 268px;
     
  }
` 

export const ImageWrapper = styled.div`
  width: 100%;
  position: relative;
  height: 0; 
`;
