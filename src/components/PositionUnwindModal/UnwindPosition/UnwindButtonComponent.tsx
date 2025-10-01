import {
  GradientLoaderButton,
  GradientOutlineButton,
  GradientSolidButton,
} from "../../../components/Button";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useMemo, useState } from "react";
import { OpenPositionData, UnwindStateSuccess, toWei } from "overlay-sdk";
import { Address } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";
import { useTradeActionHandlers } from "../../../state/trade/hooks";
import { useArcxAnalytics } from "@0xarc-io/analytics";
import useAccount from "../../../hooks/useAccount";
import { usePublicClient } from "wagmi";

type UnwindButtonComponentProps = {
  position: OpenPositionData;
  unwindBtnState: string;
  inputValue: string;
  unwindPercentage: number;
  priceLimit: bigint;
  isPendingTime: boolean;
  handleDismiss: () => void;
  unwindState: UnwindStateSuccess;
  onUnwindSuccess?: (
    unwindState: UnwindStateSuccess,
    inputValue: string,
    unwindPercentage: number,
    transactionHash?: string,
    blockNumber?: number
  ) => void;
};

const UnwindButtonComponent: React.FC<UnwindButtonComponentProps> = ({
  position,
  unwindBtnState,
  inputValue,
  unwindPercentage,
  priceLimit,
  isPendingTime,
  handleDismiss,
  unwindState,
  onUnwindSuccess,
}) => {
  const sdk = useSDK();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const { handleTxnHashUpdate } = useTradeActionHandlers();
  const arcxAnalytics = useArcxAnalytics();
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();

  const [attemptingUnwind, setAttemptingUnwind] = useState(false);

  const title: string | undefined = useMemo(() => {
    if (inputValue === "") return "Unwind";
    if (isPendingTime) return "Unwind";
    return unwindBtnState;
  }, [unwindBtnState, inputValue, isPendingTime]);

  const isDisabledUnwindButton = useMemo(() => {
    return title === "Unwind" && inputValue !== "" ? false : true;
  }, [inputValue, title]);

  const handleError = (error: Error) => {
    const errorString = JSON.stringify(error);
    const errorObj = JSON.parse(errorString);

    const errorCode: number | string =
      errorObj.cause?.cause?.code || errorObj.code;

    const errorMessage =
      errorObj.cause?.shortMessage || errorObj.cause?.cause?.shortMessage;
    return { errorCode, errorMessage };
  };

  const handleUnwind = async () => {
    if (!sdk || !publicClient || !address) {
      console.error("Missing required dependencies for unwind operation");
      return;
    }

    if (!position || !unwindPercentage || !inputValue || !priceLimit) {
      console.error("Missing required parameters for unwind operation");
      return;
    }

    setAttemptingUnwind(true);
    let handledByCallback = false;

    try {
      const result = await sdk.market.unwind({
        marketAddress: position.marketAddress as Address,
        positionId: BigInt(position.positionId),
        fraction: toWei(unwindPercentage),
        priceLimit,
      });

      let receipt = result.receipt;

      if (!receipt) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("TRANSACTION_TIMEOUT")), 60_000)
          );

          receipt = await Promise.race([
            publicClient.waitForTransactionReceipt({ hash: result.hash }),
            timeoutPromise,
          ]);
        } catch (waitError: any) {
          if (waitError.message === "TRANSACTION_TIMEOUT") {
            console.warn("Transaction confirmation timeout:", waitError);

            addPopup(
              {
                txn: {
                  hash: result.hash,
                  success: null,
                  message:
                    "Transaction is taking longer than expected. It may still confirm.",
                  type: TransactionType.UNWIND_OVL_POSITION,
                },
              },
              result.hash
            );
            return;
          } else {
            throw waitError;
          }
        }
      }

      if (receipt) {
        const isSuccess = receipt.status === "success";

        addPopup(
          {
            txn: {
              hash: result.hash,
              success: isSuccess,
              message: "",
              type: TransactionType.UNWIND_OVL_POSITION,
            },
          },
          result.hash
        );

        arcxAnalytics?.transaction({
          transactionHash: result.hash,
          account: address,
          chainId,
          metadata: {
            action: TransactionType.UNWIND_OVL_POSITION,
          },
        });

        // Handle successful unwind - call onUnwindSuccess if provided
        if (isSuccess && onUnwindSuccess) {
          handledByCallback = true;
          onUnwindSuccess(
            unwindState,
            inputValue,
            unwindPercentage,
            result.hash,
            receipt.blockNumber ? Number(receipt.blockNumber) : undefined
          );
          // Don't update transaction hash immediately - let the share modal handle it
          // This prevents portfolio refresh while user is viewing/sharing
        } else if (isSuccess && receipt.blockNumber) {
          // Only update transaction hash if not showing share modal
          handleTxnHashUpdate(result.hash, Number(receipt.blockNumber));
        }
      } else {
        console.error("No receipt received after successful wait");
        addPopup(
          {
            txn: {
              hash: result.hash,
              success: false,
              message: "Transaction status unknown. Please check your wallet.",
              type: TransactionType.UNWIND_OVL_POSITION,
            },
          },
          result.hash
        );
      }
    } catch (error) {
      console.error("Unwind operation failed:", error);

      const { errorCode, errorMessage } = handleError(error as Error);

      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: false,
            message: errorMessage,
            type: errorCode,
          },
        },
        currentTimeForId
      );
    } finally {
      setAttemptingUnwind(false);
      // Only dismiss if we haven't handled success via onUnwindSuccess callback
      if (!handledByCallback) {
        handleDismiss();
      }
    }
  };

  return (
    <>
      {!isDisabledUnwindButton && !attemptingUnwind && (
        <GradientSolidButton
          title={"Unwind"}
          width={"100%"}
          height={"46px"}
          handleClick={handleUnwind}
          isDisabled={isPendingTime}
        />
      )}

      {isDisabledUnwindButton && !attemptingUnwind && (
        <GradientOutlineButton
          title={title}
          width={"100%"}
          height={"46px"}
          size={"14px"}
          isDisabled={isDisabledUnwindButton}
        />
      )}

      {attemptingUnwind && (
        <GradientLoaderButton
          height={"46px"}
          size={"14px"}
          title={"Pending confirmation..."}
        />
      )}
    </>
  );
};

export default UnwindButtonComponent;
