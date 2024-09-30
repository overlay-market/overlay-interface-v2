import { Box } from "@radix-ui/themes";
import styled from "styled-components";

export const Bar = styled(Box)<{ width?: number; color: string }>`
  position: relative;
  height: 4px;
  transition: 1s ease-out;
  transition-property: width, background-color;
  width: ${({ width }) => `${width}%`};
  background-color: ${({ color }) => color};
  animation: progressAnimation 1s;
`;