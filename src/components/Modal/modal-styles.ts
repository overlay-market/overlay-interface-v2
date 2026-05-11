import styled from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import  theme  from "../../theme";

export const StyledOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.72);
  position: fixed;
  inset: 0;
  backdrop-filter: blur(6px);
`;

export const StyledContent = styled(Dialog.Content)<{
  minheight?: string;
  maxheight?: string;
  width?: string;
  maxwidth?: string;
  bordercolor?: string;
  boxshadow?: string;
}>`
  background-color: ${theme.semantic.panel};
  border-radius: ${theme.radius.lg};
  box-sizing: border-box;
  padding: 24px;
  width: 80%;
  max-width: ${({ maxwidth }) => (maxwidth ? maxwidth : "80%")};
  min-height: ${({ minheight }) => (minheight ? minheight : "")};
  max-height: ${({ maxheight }) => (maxheight ? maxheight : "")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
  box-shadow: ${({ boxshadow }) =>
    boxshadow ?? theme.shadow.popover};
  border: 1px solid ${({ bordercolor }) => bordercolor ?? theme.semantic.border};
  @media (min-width: ${theme.breakpoints.xs}) {
    width: ${({ width }) => (width ? width : "400px")};
  }
`;

export const StyledClose = styled(Dialog.Close)`
  color: ${theme.color.grey2};
  border-radius: ${theme.radius.sm};
  &:hover {
    color: ${theme.semantic.accent};
  }
`;
