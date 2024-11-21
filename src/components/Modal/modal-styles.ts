import styled from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import  theme  from "../../theme";

export const StyledOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  backdrop-filter: blur(7px);
`;

export const StyledContent = styled(Dialog.Content)<{
  minheight?: string;
  maxheight?: string;
  width?: string;
  maxwidth?: string;
  bordercolor?: string;
  boxshadow?: string;
}>`
  background-color: ${theme.color.background};
  border-radius: 20px;
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
    boxshadow ?? `0px 0px 12px 6px rgba(91, 96, 164, 0.25)`};
  border: 1px solid ${({ bordercolor }) => bordercolor ?? `${theme.color.blue2}80`};
  @media (min-width: ${theme.breakpoints.xs}) {
    width: ${({ width }) => (width ? width : "400px")};
  }
`;

export const StyledClose = styled(Dialog.Close)`
  color: ${theme.color.grey2};
  &:hover {
    opacity: 0.7;
  }
`;