import { Button } from "@radix-ui/themes";
import styled, { keyframes } from "styled-components";
import theme from "../../theme";

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`

export const GradientOutlineBtnWrapper = styled(Button)<{
  width?: string;
  height?: string;
  disabled?: boolean;
}>`
  padding: 7px 16px;
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
  border: 1px solid transparent;  
  border-radius: 8px;
  background: ${({ disabled }) => (disabled 
    ? `linear-gradient(${theme.color.grey7}, ${theme.color.background}) padding-box,
    linear-gradient(90deg, ${theme.color.grey4} 0%, ${theme.color.grey4} 100%) border-box`
    : `linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
      linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box`)};

  &:hover {
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0px 0px 12px 3px #ffffff73')};
  }
`;

export const ButtonTitle = styled.div<{ color?: string, disabled?: boolean }>`
  background: ${({ disabled }) => (disabled 
    ? `linear-gradient(90deg, ${theme.color.grey3} 0%, #ff7cd5 100%)` 
    : `linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%)`)};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

export const GradientSolidBtnWrapper = styled(Button)<{
  width?: string;
  height?: string;
  disabled?: boolean;
}>`
  padding: 7px 16px;
  border-radius: 8px;
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  
  &:hover {
    box-shadow:  ${({ disabled }) => (disabled ? 'none' : '0px 0px 12px 3px #ffffff73')};
  }
`;

export const GradientLoaderBtnWrapper = styled(Button)<{
  width?: string;
  height?: string;
}>`
  padding: 7px 16px;
  width: ${({ width }) => (width ? width : "100%")};
  height: ${({ height }) => (height ? height : "40px")};
  border: 1px solid transparent;  
  border-radius: 8px;
  cursor: auto;
  background: linear-gradient(${theme.color.grey7}, ${theme.color.background}) padding-box,
    linear-gradient(90deg, ${theme.color.grey4} 0%, ${theme.color.grey4} 100%) border-box;
  
  background-image: linear-gradient(
    to right,
    ${theme.color.grey7} 0%,
    ${theme.color.grey6} 20%,
    ${theme.color.grey4} 40%,
    ${theme.color.grey7} 100%
  );
  background-size: 800px 104px;
  display: inline-block;
  position: relative;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmer};
  animation-timing-function: linear;
`;
