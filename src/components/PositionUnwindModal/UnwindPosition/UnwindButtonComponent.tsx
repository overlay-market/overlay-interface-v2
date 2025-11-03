import {
  GradientLoaderButton,
  GradientOutlineButton,
  GradientSolidButton,
} from "../../../components/Button";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useMemo, useState, useEffect } from "react";
import { OpenPositionData, UnwindStateSuccess, toWei } from "overlay-sdk";
import { Address } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";
import { useTradeActionHandlers, useTradeState } from "../../../state/trade/hooks";
import useAccount from "../../../hooks/useAccount";
import { usePublicClient, useConnectorClient } from "wagmi";
import { trackEvent } from "../../../analytics/trackEvent";
import { isMobileDevice } from "../../../utils/shareUtils";

type UnwindButtonComponentProps = {
  position: OpenPositionData;
  unwindBtnState: string;
  inputValue: string;
  unwindPercentage: number;
  priceLimit: bigint;
  isPendingTime: boolean;
  unwindStable?: boolean;
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
  unwindStable,
  handleDismiss,
  unwindState,
  onUnwindSuccess,
}) => {
  const sdk = useSDK();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const { handleTxnHashUpdate } = useTradeActionHandlers();
  const { slippageValue } = useTradeState();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useConnectorClient();

  const [attemptingUnwind, setAttemptingUnwind] = useState(false);
  const [walletTimeout, setWalletTimeout] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("Pending confirmation...");
  const [elapsedTime, setElapsedTime] = useState(0);

  const isMobile = isMobileDevice();

  // Progressive message updates while waiting for wallet signature
  useEffect(() => {
    if (!attemptingUnwind) {
      setElapsedTime(0);
      setPendingMessage("Pending confirmation...");
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);

      if (elapsed < 5) {
        setPendingMessage("Waiting for wallet...");
      } else if (elapsed < 15) {
        setPendingMessage(isMobile ? "Please check your wallet app" : "Waiting for signature...");
      } else {
        setPendingMessage(isMobile ? "Open your wallet to sign" : "Check your wallet extension");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptingUnwind, isMobile]);

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

  const handleCancel = () => {
    console.log("User cancelled after wallet timeout");
    setAttemptingUnwind(false);
    setWalletTimeout(false);
    handleDismiss();
  };

  const handleRetry = () => {
    console.log("User retrying after wallet timeout");
    setWalletTimeout(false);
    setAttemptingUnwind(false);
    // Reset and retry after a brief moment
    setTimeout(() => {
      handleUnwind();
    }, 100);
  };

  const handleOpenWallet = () => {
    console.log("User attempting to manually open wallet");
    // On mobile, this provides a hint - user still needs to manually open their wallet app
    // The transaction should be queued there
    if (isMobile) {
      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: null,
            message: "Please open your wallet app and sign any pending transactions.",
            type: "WALLET_INSTRUCTION",
          },
        },
        currentTimeForId
      );
    }
  };

  const handleUnwind = async () => {
    if (!sdk || !publicClient || !address) {
      console.error("Missing required dependencies for unwind operation");
      return;
    }

    if (!walletClient) {
      console.error("Wallet client not available - wallet may be disconnected");
      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: false,
            message: "Wallet disconnected. Please reconnect your wallet and try again.",
            type: "WALLET_ERROR",
          },
        },
        currentTimeForId
      );
      return;
    }

    if (!position || !unwindPercentage || !inputValue || !priceLimit) {
      console.error("Missing required parameters for unwind operation");
      return;
    }

    setAttemptingUnwind(true);
    setWalletTimeout(false);
    let handledByCallback = false;
    let isSignatureTimeout = false;

    console.log("Starting unwind transaction", {
      isMobile,
      walletClientExists: !!walletClient,
      marketAddress: position.marketAddress,
      positionId: position.positionId,
    });

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

      // Wrap unwind operation with timeout to detect stuck wallet signatures
      const SIGNATURE_TIMEOUT_MS = 15000; // 15 seconds

      const executeUnwind = async () => {
        // Try stable unwind if preference is set
        if (unwindStable) {
          try {
            return await sdk.shiva.unwindStable({
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
              throw stableError;
            }

            // Check if it's a swap/1inch related error (not user rejection)
            const isSwapError =
              stableError?.message?.includes('1Inch') ||
              stableError?.message?.includes('swap') ||
              stableError?.message?.includes('Failed to fetch swap data');

            if (isSwapError) {
              // Fallback to normal unwind only for swap errors
              const fallbackResult = await sdk.market.unwind(unwindParams);

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

              return fallbackResult;
            } else {
              throw stableError;
            }
          }
        } else {
          return await sdk.market.unwind(unwindParams);
        }
      };

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => {
          console.warn("Wallet signature timeout - transaction may be queued in wallet");
          reject(new Error("WALLET_SIGNATURE_TIMEOUT"));
        }, SIGNATURE_TIMEOUT_MS)
      );

      const result = await Promise.race([executeUnwind(), timeoutPromise]);

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
        } catch (waitError: unknown) {
          if (waitError instanceof Error && waitError.message === "TRANSACTION_TIMEOUT") {
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

      // Handle wallet signature timeout specifically
      if ((error as Error).message === "WALLET_SIGNATURE_TIMEOUT") {
        console.warn("Wallet signature timeout detected", {
          isMobile,
          elapsedTime,
        });

        isSignatureTimeout = true;
        setWalletTimeout(true);
        // Don't reset attemptingUnwind yet - let user retry or cancel
        // Don't call handleDismiss - show retry/cancel options instead

        trackEvent("unwind_wallet_timeout", {
          is_mobile: isMobile,
          elapsed_time: elapsedTime,
          wallet_address: address,
          timestamp: new Date().toISOString(),
        });
        return; // Exit early, don't reset state yet
      }

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
      // Only reset state if not in wallet timeout (which has its own handling)
      if (!isSignatureTimeout) {
        setAttemptingUnwind(false);
        // Only dismiss if we haven't handled success via onUnwindSuccess callback
        if (!handledByCallback) {
          handleDismiss();
        }
      }
    }
  };

  return (
    <>
      {/* Wallet timeout state - show retry/cancel options */}
      {walletTimeout && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          <div style={{
            padding: "12px",
            background: "rgba(255, 193, 7, 0.1)",
            border: "1px solid rgba(255, 193, 7, 0.3)",
            borderRadius: "8px",
            fontSize: "13px",
            lineHeight: "1.4",
            color: "#ffc107"
          }}>
            {isMobile
              ? "Your wallet may not be showing the transaction. Please open your wallet app to check for pending transactions."
              : "Your wallet extension may not be showing the transaction prompt. Please check your wallet extension."}
          </div>

          {isMobile ? (
            <>
              <GradientSolidButton
                title="Open Wallet"
                width="100%"
                height="46px"
                handleClick={handleOpenWallet}
              />
              <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                <GradientSolidButton
                  title="Retry"
                  width="50%"
                  height="46px"
                  handleClick={handleRetry}
                />
                <GradientOutlineButton
                  title="Cancel"
                  width="50%"
                  height="46px"
                  size="14px"
                  handleClick={handleCancel}
                />
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
              <GradientSolidButton
                title="Retry"
                width="50%"
                height="46px"
                handleClick={handleRetry}
              />
              <GradientOutlineButton
                title="Cancel"
                width="50%"
                height="46px"
                size="14px"
                handleClick={handleCancel}
              />
            </div>
          )}
        </div>
      )}

      {/* Normal unwind button when not attempting and no timeout */}
      {!isDisabledUnwindButton && !attemptingUnwind && !walletTimeout && (
        <GradientSolidButton
          title={"Unwind"}
          width={"100%"}
          height={"46px"}
          handleClick={handleUnwind}
          isDisabled={isPendingTime}
        />
      )}

      {/* Disabled state */}
      {isDisabledUnwindButton && !attemptingUnwind && !walletTimeout && (
        <GradientOutlineButton
          title={title}
          width={"100%"}
          height={"46px"}
          size={"14px"}
          isDisabled={isDisabledUnwindButton}
        />
      )}

      {/* Loading state with progressive messages */}
      {attemptingUnwind && !walletTimeout && (
        <GradientLoaderButton
          height={"46px"}
          size={"14px"}
          title={pendingMessage}
        />
      )}
    </>
  );
};

export default UnwindButtonComponent;
