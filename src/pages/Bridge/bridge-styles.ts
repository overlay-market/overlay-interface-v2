import styled from "styled-components";
import theme from "../../theme";
import { Box, Flex, Text } from "@radix-ui/themes";

export const BridgeContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  direction: column;
  padding-top: 32px;
  justify-content: center;
  align-items: start;

  @media (min-width: ${theme.breakpoints.sm}) {  
    height: calc(100vh - 140px);  
    padding-top: 0;
    align-items: center;
  }  
`;

export const GradientBorderBox = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {    
    border: solid 1px transparent; 
    border-radius: 16px;
    background: linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
      linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;
    box-shadow: 0px 0px 12px 3px rgba(255, 255, 255, 0.45);
  }  
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  outline: none;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  color: ${theme.color.white};
  background-color: ${theme.color.grey4};
  font-size: 14px;
  font-weight: 600;
  font-family: Inter;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::placeholder {
    color: #6c7180;
  }
`;

export const SourceChainSelectButton = styled(Box)<{ active: string }>`
  padding: 4px 12px;
  border-radius: 8px;
  width: 100%;  
  height: 50px;
  background:  ${ theme.color.grey4};
  cursor: pointer; 
  border: ${(props) => (props.active === 'true' ? `1px solid ${theme.color.blue2}90` : '')};
  
  &:hover {
    border: ${(props) => (props.active === 'true' ? `1px solid ${theme.color.blue2}` : '')};
    opacity: ${(props) => (props.active === 'false' ? '0.8' : '')};
  }
`

export const ChainBox = styled(Box)`
  padding: 8px 8px 12px 8px;
  border-radius: 8px;
  width: 100%;  
  background:  ${ theme.color.grey4};
`

export const SwapDirectionButton = styled(Flex)`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer; 
  outline: none;

  &:hover {
    opacity: 0.9;    
  }
`

export const LabelText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.color.grey3};
`

export const ChainText = styled(Text)`
  font-size: 16px;
  font-weight: 700;
`
