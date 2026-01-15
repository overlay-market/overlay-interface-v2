import {
  GradientLoaderButton,
  GradientOutlineButton,
  GradientSolidButton,
} from "../../../components/Button";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useMemo, useState } from "react";
import { OpenPositionData, toWei } from "overlay-sdk";
import { Address } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";
import { useTradeActionHandlers, useTradeState } from "../../../state/trade/hooks";
import useAccount from "../../../hooks/useAccount";
import { usePublicClient } from "wagmi";
import { trackEvent } from "../../../analytics/trackEvent";

type UnwindButtonComponentProps = {
  position: OpenPositionData;
  unwindBtnState: string;
  inputValue: string;
  unwindPercentage: number;
  priceLimit: bigint;
  isPendingTime: boolean;
  unwindStable?: boolean;
  handleDismiss: () => void;
};

const UnwindButtonComponent: React.FC<UnwindButtonComponentProps> = ({
  position,
  unwindBtnState,
  inputValue,
  unwindPercentage,
  priceLimit,
  isPendingTime,
  unwindStable,
  handleDismiss,
}) => {
  const sdk = useSDK();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const { handleTxnHashUpdate } = useTradeActionHandlers();
  const { slippageValue } = useTradeState();
  const { address } = useAccount();
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

    try {
      const parsedSlippage = Number(slippageValue);
      const slippage =
        Number.isFinite(parsedSlippage) && parsedSlippage > 0
          ? parsedSlippage
          : 1;

      const unwindParams = {
        marketAddress: position.marketAddress as Address,
        positionId: BigInt(position.positionId),
        fraction: toWei(unwindPercentage),
        priceLimit,
      };

      let result;

      // Try stable unwind if preference is set
      if (unwindStable) {
        try {
          result = await sdk.shiva.unwindStable({
            ...unwindParams,
            account: address as Address,
            slippage,
          });
        } catch (stableError: any) {
          // Check if user rejected the transaction
          const isUserRejection =
            stableError?.code === 4001 ||
            stableError?.code === "ACTION_REJECTED" ||
            stableError?.message?.toLowerCase().includes('user rejected') ||
            stableError?.message?.toLowerCase().includes('user denied');

          if (isUserRejection) {
            // User rejected - don't fallback, just throw the error
            throw stableError;
          }

          // Check if it's a swap/1inch related error (not user rejection)
          const isSwapError =
            stableError?.message?.includes('1Inch') ||
            stableError?.message?.includes('swap') ||
            stableError?.message?.includes('Failed to fetch swap data');

          if (isSwapError) {
            // Fallback to normal unwind only for swap errors
            result = await sdk.market.unwind({ ...unwindParams, account: address as Address });

            // Inform user about fallback
            addPopup(
              {
                txn: {
                  hash: currentTimeForId,
                  success: null,
                  message: "USDT conversion unavailable. Proceeding with OVL unwind.",
                  type: TransactionType.UNWIND_OVL_POSITION,
                },
              },
              currentTimeForId
            );
          } else {
            // Unknown error - don't fallback, throw it
            throw stableError;
          }
        }
      } else {
        result = await sdk.market.unwind({ ...unwindParams, account: address as Address });
      }

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

        trackEvent("unwind_ovl_position_success", {
          transaction_hash: `hash_${result.hash}`,
          wallet_address: address,
          timestamp: new Date().toISOString(),
        });

        if (receipt.blockNumber) {
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

      trackEvent("unwind_ovl_position_failed", {
        error_message: errorMessage,
        wallet_address: address,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setAttemptingUnwind(false);
      handleDismiss();
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
