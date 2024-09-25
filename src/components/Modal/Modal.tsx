import React from "react";
import styled from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import { theme } from "../../theme/theme";
import { X } from "react-feather";

const StyledOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  backdrop-filter: blur(7px);
`;

const StyledContent = styled(Dialog.Content)<{
  minHeight?: string | false;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
  borderColor?: string;
  boxShadow?: string;
}>`
  background-color: ${theme.color.background};
  border-radius: 20px;
  box-sizing: border-box;
  padding: 24px;
  width: 80%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "80%")};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : "")};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : "")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: ${({ boxShadow }) =>
    boxShadow ?? `0 4px 8px 0 ${theme.color.background}80`};
  border: 1px solid ${({ borderColor }) => borderColor ?? "#12b4ff"};
  @media (min-width: ${theme.breakpoints.xs}) {
    width: ${({ width }) => (width ? width : "400px")};
  }
`;

interface ModalProps {
  minHeight?: string | false;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  triggerElement: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
}

export default function Modal({
  width,
  maxWidth,
  minHeight = false,
  maxHeight,
  borderColor,
  boxShadow,
  triggerElement,
  title,
  children,
}: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent
          width={width}
          maxWidth={maxWidth}
          minHeight={minHeight}
          maxHeight={maxHeight}
          borderColor={borderColor}
          boxShadow={boxShadow}
        >
          <Dialog.Title
            style={{ margin: "0", fontSize: "20px", textAlign: "center" }}
          >
            {title}
          </Dialog.Title>

          {children}

          <Dialog.Close
            asChild
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              cursor: "pointer",
            }}
          >
            <X size={24} color={theme.color.grey1} />
          </Dialog.Close>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
