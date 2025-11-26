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
import { trackEvent } from "../../analytics/trackEvent";

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

  // Filter out LBSC positions (positions with loans)
  const positionsWithLoans = selectedPositions.filter(pos => pos.loan);
  const positionsWithoutLoans = selectedPositions.filter(pos => !pos.loan);
  const hasLBSCPositions = positionsWithLoans.length > 0;

  const multipleUnwind = async () => {
    try {
      setIsUnwinding(true);
      // Only unwind positions without loans (non-LBSC positions)
      const transactions = await sdk.market.unwindMultiple({
        positions: positionsWithoutLoans.map((pos) => ({
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
            transaction_hash: `hash_${txnResult.hash}`,
            wallet_address: account,
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
            wallet_address: account,
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

        {hasLBSCPositions ? (
          <Flex direction="column" gap="3">
            <Text size="2">
              You are about to close {positionsWithoutLoans.length} position
              {positionsWithoutLoans.length !== 1 ? "s" : ""}.
            </Text>

            <Flex
              p="12px"
              style={{
                background: 'rgba(255, 193, 7, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${theme.color.yellow1}`,
              }}
            >
              <Text size="2" style={{ color: theme.color.yellow1 }}>
                {positionsWithLoans.length} USDT-collateralized position
                {positionsWithLoans.length !== 1 ? "s" : ""} will be skipped.
                These positions must be closed individually at 100% in the position details.
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Text size="2" mb="4">
            You are about to close {selectedCount} selected position
            {selectedCount !== 1 ? "s" : ""}. This action cannot be undone.
          </Text>
        )}

        <Flex gap="3" justify="end" mt={"4"}>
          <ColorButton
            onClick={handleDismiss}
            width="140px"
            bgcolor={theme.color.grey4}
            color={theme.color.grey1}
            disabled={isUnwinding}
          >
            Cancel
          </ColorButton>
          <ColorButton
            onClick={multipleUnwind}
            width="140px"
            disabled={isUnwinding || positionsWithoutLoans.length === 0}
          >
            {isUnwinding ? "Pending..." : "Confirm"}
          </ColorButton>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ClosePositionsModal;
