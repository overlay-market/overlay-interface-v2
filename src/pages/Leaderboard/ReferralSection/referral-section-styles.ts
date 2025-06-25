import { Box, Flex, Text } from "@radix-ui/themes";
import styled, { keyframes } from "styled-components";
import theme from "../../../theme";

export const GradientBorderBox = styled(Flex)`
  padding: 10px 20px;
  width: 100%;
  justify-content: center;
  border: solid 1px transparent; 
  border-radius: 32px;
  background: linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
      linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 14px 50px;
    width: auto;
  }     
`;

export const GradientText = styled(Text)`
  width: fit-content;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

export const CopyLink = styled(Box)`
  cursor: pointer;
  position: relative;
`;

export const Toast = styled.div<{visible: string}>`
  position: fixed;
  bottom: 110px;
  width: 160px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.color.grey7};
  color: ${theme.color.grey2};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${({ visible }) => (visible === 'true' ? 1 : 0)};
  visibility: ${({ visible }) => (visible === 'true' ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;

  @media (min-width: ${theme.breakpoints.sm}) {
    bottom: 20px;
    left: 52.5%;
  } 
`;

const colorCycle = keyframes`
  0%, 100% {
    background-color: #ffc955;
  }
  50% {
    background-color: #ff7cd5;
  }
`;

export const Dot = styled("span")<{ delay: string }>`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #ffc955;
  animation: ${colorCycle} 0.8s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay};
`;

export const DotContainer = styled(Flex)`
  gap: 5px;
  align-items: end;
  padding-bottom: 4px;
`;