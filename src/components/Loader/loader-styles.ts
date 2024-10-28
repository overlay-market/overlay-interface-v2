import styled, { keyframes } from "styled-components";
import theme from "../../theme";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke }) => stroke ?? theme.color.white};
  }
`;