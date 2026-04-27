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
  border-radius: ${theme.radius.md};
  background: ${({ disabled }) => (disabled 
    ? `linear-gradient(${theme.semantic.panel}, ${theme.semantic.panel}) padding-box,
    linear-gradient(90deg, ${theme.semantic.border} 0%, ${theme.semantic.border} 100%) border-box`
    : `linear-gradient(${theme.semantic.panel}, ${theme.semantic.panel}) padding-box,
      ${theme.gradient.accent} border-box`)};
  color: ${theme.semantic.accent};
  font-weight: 700;
  transition: background 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;

  &:hover {
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 0 0 1px rgba(243, 169, 27, 0.35), 0 8px 18px rgba(0, 0, 0, 0.28)')};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const ButtonTitle = styled.div<{ color?: string, disabled?: boolean }>`
  background: ${({ disabled }) => (disabled 
    ? `linear-gradient(90deg, ${theme.semantic.textMuted} 0%, ${theme.semantic.textSecondary} 100%)` 
    : theme.gradient.accentText)};
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
  border-radius: ${theme.radius.md};
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
  background: ${theme.gradient.accent};
  color: ${theme.color.black};
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  box-shadow: none;
  transition: filter 0.16s ease, box-shadow 0.16s ease;
  
  &:hover {
    box-shadow:  ${({ disabled }) => (disabled ? 'none' : '0 8px 18px rgba(240, 185, 11, 0.22)')};
    filter: ${({ disabled }) => (disabled ? 'none' : 'brightness(1.05)')};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
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
  border-radius: ${theme.radius.md};
  cursor: auto;
  background: linear-gradient(${theme.semantic.panel}, ${theme.semantic.panel}) padding-box,
    linear-gradient(90deg, ${theme.semantic.border} 0%, ${theme.semantic.border} 100%) border-box;
  
  background-image: linear-gradient(
    to right,
    ${theme.semantic.panel} 0%,
    ${theme.semantic.hover} 20%,
    ${theme.semantic.field} 40%,
    ${theme.semantic.panel} 100%
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
