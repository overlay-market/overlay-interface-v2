import { Dialog, Flex, Text } from "@radix-ui/themes";
import Loader from "../Loader";
import { useState } from "react";
import { OpenPositionData } from "overlay-sdk";
import useAccount from "../../hooks/useAccount";
import useSDK from "../../hooks/useSDK";
import theme from "../../theme";
import { ColorButton } from "../Button/ColorButton";

type ClosePositionsModalProps = {
  open: boolean;
  handleDismiss: () => void;
  selectedCount: number;
  selectedPositions: OpenPositionData[];
  onConfirm: () => void;
};

const ClosePositionsModal: React.FC<ClosePositionsModalProps> = ({
  open,
  handleDismiss,
  selectedCount,
  selectedPositions,
  onConfirm,
}) => {
  const sdk = useSDK();
  const [isUnwinding, setIsUnwinding] = useState(false);
  const { address: account } = useAccount();

  const multipleUnwind = async () => {
    try {
      setIsUnwinding(true);
      const result = await sdk.market.unwindMultiple({
        positions: selectedPositions.map((pos) => ({
          marketAddress: pos.marketAddress,
          positionId: pos.positionId,
        })),
        account,
        slippage: 1,
        unwindPercentage: 1,
      });

      console.log("Multiple unwind result: ", result);
      onConfirm();
    } catch (error) {
      console.error("Error in multiple unwinding market", error);
    } finally {
      setIsUnwinding(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleDismiss}>
      <Dialog.Content style={{ backgroundColor: theme.color.background }}>
        <Dialog.Title>Close Selected Positions</Dialog.Title>
        <Text size="2" mb="4">
          You are about to close {selectedCount} selected position
          {selectedCount !== 1 ? "s" : ""}. This action cannot be undone.
        </Text>

        <Flex gap="3" justify="end" mt={"4"}>
          {" "}
          <ColorButton
            onClick={handleDismiss}
            width="140px"
            bgColor={theme.color.grey4}
            color={theme.color.grey1}
            disabled={isUnwinding}
          >
            Cancel
          </ColorButton>
          <ColorButton
            onClick={multipleUnwind}
            width="140px"
            disabled={isUnwinding}
          >
            {isUnwinding ? <Loader /> : "Confirm"}
          </ColorButton>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ClosePositionsModal;
