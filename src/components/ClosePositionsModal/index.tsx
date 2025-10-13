import { Dialog, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { OpenPositionData, SDKError } from "overlay-sdk";
import useAccount from "../../hooks/useAccount";
import theme from "../../theme";
import { ColorButton } from "../Button/ColorButton";
import { useAddPopup } from "../../state/application/hooks";
import { TransactionType } from "../../constants/transaction";
import { currentTimeParsed } from "../../utils/currentTime";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import { TransactionResult } from "overlay-sdk/dist/core/types";
import useSDK from "../../providers/SDKProvider/useSDK";
import { trackEvent } from "../../utils/analytics";

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
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const { handleTxnHashUpdate } = useTradeActionHandlers();

  const multipleUnwind = async () => {
    try {
      setIsUnwinding(true);
      const transactions = await sdk.market.unwindMultiple({
        positions: selectedPositions.map((pos) => ({
          marketAddress: pos.marketAddress,
          positionId: pos.positionId,
        })),
        account,
        slippage: 1,
        unwindPercentage: 1,
      });

      console.log("Multiple unwind transactions", transactions);

      // Handle array of transactions
      transactions.forEach((tx) => {
        if (tx.status === "fulfilled") {
          const txnResult = tx.value as TransactionResult;
          addPopup(
            {
              txn: {
                hash: txnResult.hash,
                success: true,
                message: "",
                type: TransactionType.UNWIND_OVL_POSITION,
              },
            },
            txnResult.hash
          );

          trackEvent("unwind_ovl_position_success", {
            transaction_hash: txnResult.hash,
            account: account,
            timestamp: new Date().toISOString(),
          });

          handleTxnHashUpdate(txnResult.hash, 0);
        } else {
          const error = tx.reason as SDKError;
          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: error.message,
                type: TransactionType.UNWIND_OVL_POSITION,
              },
            },
            currentTimeForId
          );

          trackEvent("unwind_ovl_position_failed", {
            error_message: error.message,
            account: account,
            timestamp: new Date().toISOString(),
          });
        }
      });

      onConfirm();
      handleDismiss();
    } catch (error: Error | unknown) {
      console.error("Error in multiple unwinding market", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to close positions";

      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: false,
            message: errorMessage,
            type: TransactionType.UNWIND_OVL_POSITION,
          },
        },
        currentTimeForId
      );
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
            {isUnwinding ? "Pending..." : "Confirm"}
          </ColorButton>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ClosePositionsModal;
