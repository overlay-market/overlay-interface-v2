import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { Link } from "react-router-dom";
import theme from "../../../theme";

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`

export const GradientBorderBox = styled(Flex)<{ bordercolor?: string }>`
  @media (min-width: ${theme.breakpoints.sm}) {    
    border: solid 1px ${({ bordercolor }) => (bordercolor ? bordercolor : 'transparent')}; 
    border-radius: 16px;
    background: ${({ bordercolor }) => (bordercolor ? '' : `linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
      linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box`)};
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

export const DisabledButton = styled.button`
  width: 100%;
  height: 49px;
  color: ${theme.color.grey11};
  background: #393939;
  cursor: default;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: opacity 0.2s ease;
`;

export const BummerContainer = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border: solid 1px ${theme.color.red1}; 
  border-radius: 16px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px 32px;
  } 
`

export const InfoContainer = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: solid 1px ${theme.color.darkBlue}; 
  border-radius: 16px;
  margin-top: -20px;

  @media (min-width: ${theme.breakpoints.sm}) {
    margin-top: 0;
  } 
`

export const GradientLink = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  color: transparent;
  --grad: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background: var(--grad), var(--grad) bottom 2px left 0/100% 1px no-repeat;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;
`;

export const StyledLink = styled(Link)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 4px;
`