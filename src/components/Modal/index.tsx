import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "react-feather";
import { StyledClose, StyledContent, StyledOverlay } from "./modal-styles";

type ModalProps = {
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
  fontSizeTitle?: string;
  textAlignTitle?: "left" | "right" | "center" | "justify";
  borderColor?: string;
  boxShadow?: string;
  triggerElement: React.ReactNode;
  handleClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  width,
  maxWidth,
  minHeight,
  maxHeight,
  fontSizeTitle = "20px",
  textAlignTitle = "center",
  borderColor,
  boxShadow,
  triggerElement,
  handleClose,
  title,
  children,
  open,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose && handleClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent
          width={width}
          maxwidth={maxWidth}
          minheight={minHeight}
          maxheight={maxHeight}
          bordercolor={borderColor}
          boxshadow={boxShadow}
        >
          <Dialog.Title
            style={{
              margin: "0 18px 0 0",
              fontSize: fontSizeTitle,
              textAlign: textAlignTitle,
            }}
          >
            {title}
          </Dialog.Title>

          {children}

          <StyledClose
            asChild
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </StyledClose>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
