import { Dialog, Button, Flex, Text } from "@radix-ui/themes";

type ClosePositionsModalProps = {
  open: boolean;
  handleDismiss: () => void;
  selectedCount: number;
  onConfirm: () => void;
};

const ClosePositionsModal: React.FC<ClosePositionsModalProps> = ({
  open,
  handleDismiss,
  selectedCount,
  onConfirm,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={handleDismiss}>
      <Dialog.Content>
        <Dialog.Title>Close Selected Positions</Dialog.Title>
        <Text size="2" mb="4">
          You are about to close {selectedCount} selected position
          {selectedCount !== 1 ? "s" : ""}. This action cannot be undone.
        </Text>

        <Flex gap="3" justify="end">
          <Button variant="soft" onClick={handleDismiss}>
            Cancel
          </Button>
          <Button variant="solid" onClick={onConfirm}>
            Confirm
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ClosePositionsModal;
