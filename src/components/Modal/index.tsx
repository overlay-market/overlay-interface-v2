import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import theme from "../../theme";
import { X } from "react-feather";
import { StyledContent, StyledOverlay } from "./modal-styles";

type ModalProps = {
  minHeight?: string | false;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  triggerElement: React.ReactNode;
  handleClose?: () => void;
  title?: string;
  children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  width,
  maxWidth,
  minHeight = false,
  maxHeight,
  borderColor,
  boxShadow,
  triggerElement,
  handleClose,
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose && handleClose();
    }
    setIsOpen(open);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
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
};

export default Modal;
