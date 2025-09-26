import {
  GradientLoaderButton,
  GradientOutlineButton,
} from "../../../components/Button";
import useAccount from "../../../hooks/useAccount";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import {
  useChainAndTokenState,
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toWei, TradeState, TradeStateData } from "overlay-sdk";
import ConfirmTxnModal from "./ConfirmTxnModal";
import { Address, maxUint256 } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";
import { useModalHelper } from "../../../components/ConnectWalletModal/utils";
import { useArcxAnalytics } from "@0xarc-io/analytics";
import { SelectState } from "../../../types/selectChainAndTokenTypes";
import { useMaxInputIncludingFees } from "../../../hooks/useMaxInputIncludingFees";
import { useRiskParamsQuery } from "../../../hooks/useRiskParamsQuery";
import { formatFixedPoint18 } from "../../../utils/formatFixedPoint18";
import { useLiFiBridge } from "../../../hooks/lifi/useLiFiBridge";
import { GetBNBModal } from "../../../components/GetBNBModal";

const TRADE_WITH_LIFI = "Bridge & Trade";
import { usePublicClient } from "wagmi";
import { waitForReceiptWithTimeout } from "../../../utils/waitForReceiptWithTimeout";

type TradeButtonComponentProps = {
  loading: boolean;
  tradeState?: TradeStateData;
};

const TradeButtonComponent: React.FC<TradeButtonComponentProps> = ({
  loading,
  tradeState,
}) => {
  const { address, chainId } = useAccount();
  const sdk = useSDK();
  const { openModal } = useModalHelper();
  const publicClient = usePublicClient();
  const { currentMarket: market } = useCurrentMarketState();
  const { handleTradeStateReset, handleTxnHashUpdate } =
    useTradeActionHandlers();
  const { typedValue, selectedLeverage, isLong } = useTradeState();
  const { chainState, tokenState } = useChainAndTokenState();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const [{ showConfirm, attemptingTransaction }, setTradeConfig] = useState<{
    showConfirm: boolean;
    attemptingTransaction: boolean;
  }>({
    showConfirm: false,
    attemptingTransaction: false,
  });
  const [isApprovalPending, setIsApprovalPending] = useState<boolean>(false);
  const [showGasModal, setShowGasModal] = useState<boolean>(false);
  const [hasShownTradeModal, setHasShownTradeModal] = useState<boolean>(false);
  const [hasShownGasModal, setHasShownGasModal] = useState<boolean>(false);
  const arcxAnalytics = useArcxAnalytics();
  const { maxInputIncludingFees } = useMaxInputIncludingFees({
    marketId: market?.marketId,
  });

  const { data: riskParamsData } = useRiskParamsQuery({
    marketId: market?.id,
  });

  const {
    executeBridge,
    bridgeStage,
    resetBridge,
    bridgedAmount,
    bridgeQuote,
    isBridging,
    getBridgeQuote,
    proceedAfterGas,
  } = useLiFiBridge(riskParamsData?.markets?.[0]?.tradingFeeRate);

  const minCollateral = useMemo(() => {
    if (riskParamsData && riskParamsData.markets.length > 0) {
      const formatted = formatFixedPoint18(
        riskParamsData.markets[0].minCollateral
      );
      const numeric = Number(formatted);
      return isNaN(numeric) ? 0 : numeric;
    } else {
      return 0;
    }
  }, [riskParamsData]);

  const isDefaultState =
    chainState === SelectState.DEFAULT && tokenState === SelectState.DEFAULT;
  const isSelectedState =
    chainState === SelectState.SELECTED && tokenState === SelectState.SELECTED;

  const tradeButtonConfig = useMemo(() => {
    const title: string = !tradeState ? "Trade" : tradeState.tradeState;

    const isDisabledTradeButton =
      typedValue &&
      !loading &&
      tradeState &&
      [
        TradeState.Trade,
        TradeState.NeedsApproval,
        TradeState.TradeHighPriceImpact,
      ].includes(tradeState.tradeState)
        ? false
        : true;

    return {
      title,
      isDisabledTradeButton,
    };
  }, [tradeState, loading, typedValue]);

  const liFiTradeButtonConfig = useMemo(() => {
    const amountExceedsMaxInput = Number(typedValue) > maxInputIncludingFees;
    const amountBelowMinCollateral =
      typedValue && Number(typedValue) < minCollateral;

    const title: string = amountExceedsMaxInput
      ? "Amount Exceeds Max Input"
      : amountBelowMinCollateral
      ? "Amount Below Min Collateral"
      : tradeState &&
        [
          TradeState.ExceedsCircuitBreakerOICap,
          TradeState.ExceedsOICap,
          TradeState.PositionUnderwater,
          TradeState.TradeHighPriceImpact,
        ].includes(tradeState.tradeState)
      ? tradeState.tradeState
      : TRADE_WITH_LIFI;

    const isDisabledTradeButton =
      !typedValue ||
      loading ||
      bridgeStage.stage === "bridging" ||
      bridgeStage.stage === "quote" ||
      bridgeStage.stage === "approval" ||
      amountExceedsMaxInput ||
      amountBelowMinCollateral ||
      [
        TradeState.ExceedsCircuitBreakerOICap,
        TradeState.ExceedsOICap,
        TradeState.PositionUnderwater,
        TradeState.TradeHighPriceImpact,
      ].includes(title as TradeState)
        ? true
        : false;

    return {
      title,
      isDisabledTradeButton,
    };
  }, [
    tradeState,
    loading,
    typedValue,
    maxInputIncludingFees,
    minCollateral,
    bridgeStage,
  ]);

  const handleTrade = async () => {
    if (!sdk || !publicClient || !address) {
      console.error("Missing required dependencies for trade operation");
      return;
    }

    if (!market || !tradeState || !typedValue || !selectedLeverage) {
      console.error("Missing required parameters for trade operation");
      return;
    }

    setTradeConfig({
      showConfirm,
      attemptingTransaction: true,
    });

    try {
      const result = await sdk.market.build({
        account: address,
        marketAddress: market.id as Address,
        collateral: toWei(typedValue),
        leverage: toWei(selectedLeverage),
        isLong,
        priceLimit: toWei(tradeState.priceInfo.minPrice as string),
      });

      let receipt = result.receipt;

      if (!receipt) {
        try {
          receipt = await waitForReceiptWithTimeout(publicClient, result.hash);
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
                  type: TransactionType.BUILD_OVL_POSITION,
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
              type: TransactionType.BUILD_OVL_POSITION,
            },
          },
          result.hash
        );

        if (receipt.blockNumber) {
          handleTxnHashUpdate(result.hash, Number(receipt.blockNumber));
        }

        if (isSuccess) {
          handleTradeStateReset();
        }

        arcxAnalytics?.transaction({
          transactionHash: result.hash,
          account: address,
          chainId,
          metadata: {
            action: TransactionType.BUILD_OVL_POSITION,
          },
        });
      } else {
        console.error("No receipt received after successful wait");
        addPopup(
          {
            txn: {
              hash: result.hash,
              success: false,
              message: "Transaction status unknown. Please check your wallet.",
              type: TransactionType.BUILD_OVL_POSITION,
            },
          },
          result.hash
        );
      }
    } catch (error) {
      console.error("Trade operation failed:", error);

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
      setTradeConfig({
        showConfirm: false,
        attemptingTransaction: false,
      });
    }
  };

  const waitForTradeStateUpdate = async (
    timeoutMs: number = 20000,
    intervalMs: number = 2000
  ): Promise<boolean> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (tradeState?.tradeState !== TradeState.NeedsApproval) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return false;
  };

  const waitForBalanceUpdate = async (
    expectedAmount: bigint,
    maxWaitTime: number = 30000,
    checkInterval: number = 2000
  ): Promise<boolean> => {
    if (!sdk || !address) return false;

    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const currentBalanceRaw = await sdk.ovl.balance(address!);

        const currentBalance =
          typeof currentBalanceRaw === "bigint"
            ? currentBalanceRaw
            : BigInt(currentBalanceRaw.toString());

        if (currentBalance >= expectedAmount) {
          console.log("✅ Sufficient balance confirmed");
          return true;
        }

        await new Promise((resolve) => setTimeout(resolve, checkInterval));
      } catch (error) {
        console.error("Error checking balance:", error);
      }
    }

    console.warn("⚠️ Timeout waiting for balance update");
    return false;
  };

  const handleApprove = async () => {
    if (!sdk || !publicClient || !address) {
      console.error("Missing required dependencies for approval operation");
      return;
    }

    if (!typedValue) {
      console.error("Missing typed value for approval operation");
      return;
    }

    // For non-Shiva approvals, validate market exists
    const useShiva = sdk.core.usingShiva();
    if (!useShiva && !market?.id) {
      console.error("Missing market for approval operation");
      return;
    }

    setTradeConfig({
      showConfirm,
      attemptingTransaction: true,
    });

    try {
      const result = useShiva
        ? await sdk.shiva.approveShiva({
            account: address,
            amount: maxUint256,
          })
        : await sdk.ovl.approve({
            to: market?.id as Address,
            amount: maxUint256,
          });

      let receipt = result.receipt;

      if (!receipt) {
        try {
          receipt = await waitForReceiptWithTimeout(publicClient, result.hash);
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
                  type: TransactionType.APPROVAL,
                },
              },
              result.hash
            );
            setTradeConfig({
              showConfirm: false,
              attemptingTransaction: false,
            });
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
              type: TransactionType.APPROVAL,
            },
          },
          result.hash
        );

        if (receipt.blockNumber) {
          handleTxnHashUpdate(result.hash, Number(receipt.blockNumber));
        }

        if (isSuccess) {
          const isUpdated = await waitForTradeStateUpdate();
          setIsApprovalPending(isUpdated);
        }
      } else {
        console.error("No receipt received after successful wait");
        addPopup(
          {
            txn: {
              hash: result.hash,
              success: false,
              message: "Transaction status unknown. Please check your wallet.",
              type: TransactionType.APPROVAL,
            },
          },
          result.hash
        );
      }
    } catch (error) {
      console.error("Approval operation failed:", error);

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
      setTradeConfig({
        showConfirm,
        attemptingTransaction: false,
      });
    }
  };

  const handleError = (error: Error) => {
    try {
      const errorString = JSON.stringify(error);
      const errorObj = JSON.parse(errorString);

      const errorCode: number | string =
        errorObj.cause?.cause?.code ||
        errorObj.cause?.code ||
        errorObj.code ||
        "UNKNOWN_ERROR";

      const errorMessage =
        errorObj.cause?.shortMessage ||
        errorObj.cause?.cause?.shortMessage ||
        errorObj.message ||
        error.message ||
        "An unknown error occurred";

      return { errorCode, errorMessage };
    } catch (parseError) {
      console.error("Error parsing error object:", parseError);
      return {
        errorCode: "PARSE_ERROR",
        errorMessage: error.message || "An unknown error occurred",
      };
    }
  };

  const handleDismiss = useCallback(() => {
    setTradeConfig({
      showConfirm: false,
      attemptingTransaction,
    });
  }, [attemptingTransaction]);

  const handleLiFiGetBridgeQuote = async () => {
    if (!address || !market || !tradeState || !typedValue) {
      console.error("Missing required parameters for cross-chain trade");
      return;
    }

    // Check if we're resuming from a needs_gas state
    if (bridgeStage.stage === 'needs_gas') {
      console.log("🔋 Resuming from needs_gas stage, reopening gas modal");
      setShowGasModal(true);
      return;
    }

    const { quote, error } = await getBridgeQuote();

    if (quote) {
      setTradeConfig({
        showConfirm: true,
        attemptingTransaction: false,
      });
    } else if (error) {
      const { errorCode, errorMessage } = handleError(error);

      let message = errorMessage;
      if (errorCode === 1006) {
        message = (
          <>
            No available quotes for the requested transfer.
            <br />
            Please try again
          </>
        );
      }
      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: false,
            message: message,
            type: errorCode,
          },
        },
        currentTimeForId
      );
      setTradeConfig({
        showConfirm: false,
        attemptingTransaction: false,
      });
    }
  };

  const handleBridge = async () => {
    if (!address || !market || !tradeState || !typedValue || !bridgeQuote) {
      console.error("Missing required parameters for bridge");
      return;
    }

    try {
      await executeBridge();
    } catch (error: unknown) {
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
      setTradeConfig({
        showConfirm: false,
        attemptingTransaction: false,
      });
    }
  };

  const handleLiFiTrade = async () => {
    if (!address || !market || !tradeState || !bridgedAmount) {
      console.error("Missing required parameters for position opening");
      return;
    }

    if (!sdk || !publicClient) {
      console.error("Missing required dependencies for trade operation");
      return;
    }

    const requiredAmount = BigInt(bridgedAmount);

    // Wait for balance to update
    const balanceUpdated = await waitForBalanceUpdate(requiredAmount);
    if (!balanceUpdated) {
      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: false,
            message:
              "Bridged tokens not yet available. Please wait and try again.",
            type: "BALANCE_TIMEOUT",
          },
        },
        currentTimeForId
      );

      setTradeConfig({
        showConfirm: false,
        attemptingTransaction: false,
      });
      return;
    }

    // Check if approval is needed before building position
    if (tradeState.tradeState === TradeState.NeedsApproval) {
      console.log("🔒 Approval needed for Shiva contract after bridge");

      setTradeConfig({
        showConfirm,
        attemptingTransaction: true,
      });

      try {
        const useShiva = sdk.core.usingShiva();
        const result = useShiva
          ? await sdk.shiva.approveShiva({
              account: address,
              amount: maxUint256,
            })
          : await sdk.ovl.approve({
              to: market?.id as Address,
              amount: maxUint256,
            });

        let receipt = result.receipt;

        if (!receipt) {
          try {
            receipt = await waitForReceiptWithTimeout(
              publicClient,
              result.hash
            );
          } catch (waitError: any) {
            if (waitError.message === "TRANSACTION_TIMEOUT") {
              console.warn("Approval confirmation timeout:", waitError);

              addPopup(
                {
                  txn: {
                    hash: result.hash,
                    success: null,
                    message:
                      "Approval is taking longer than expected. It may still confirm.",
                    type: TransactionType.APPROVAL,
                  },
                },
                result.hash
              );
              setTradeConfig({
                showConfirm: false,
                attemptingTransaction: false,
              });
              return;
            } else {
              throw waitError;
            }
          }
        }

        addPopup(
          {
            txn: {
              hash: result.hash,
              success: receipt?.status === "success",
              message: "",
              type: TransactionType.APPROVAL,
            },
          },
          result.hash
        );

        if (receipt?.blockNumber) {
          handleTxnHashUpdate(result.hash, Number(receipt.blockNumber));
        }

        console.log("✅ Approval confirmed, proceeding with position build");
      } catch (error) {
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
        setTradeConfig({
          showConfirm: false,
          attemptingTransaction: false,
        });
        return;
      }
    }

    setTradeConfig({
      showConfirm,
      attemptingTransaction: true,
    });

    let collateralAmount = 0n;
    try {
      const maxInput = await sdk.trade.getMaxInputIncludingFeesFromBalance(
        market.marketId,
        BigInt(bridgedAmount),
        toWei(selectedLeverage),
        6
      );
      collateralAmount = toWei(maxInput);
    } catch (error) {
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
      setTradeConfig({
        showConfirm: false,
        attemptingTransaction: false,
      });
      return;
    }

    console.log("🏗️ Building position with:", {
      bridgedAmount: bridgedAmount,
      bridgedAmountReadable: (Number(bridgedAmount) / 1e18).toFixed(6),
      collateralAmount: collateralAmount.toString(),
      collateralReadable: (Number(collateralAmount) / 1e18).toFixed(6),
      leverage: selectedLeverage,
      dataType: typeof bridgedAmount,
      minCollateralRequired: minCollateral,
    });

    try {
      const result = await sdk.market.build({
        account: address,
        marketAddress: market?.id as Address,
        collateral: collateralAmount,
        leverage: toWei(selectedLeverage),
        isLong,
        priceLimit: toWei(tradeState.priceInfo.minPrice as string),
      });

      let receipt = result.receipt;

      if (!receipt) {
        try {
          receipt = await waitForReceiptWithTimeout(publicClient, result.hash);
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
                  type: TransactionType.BUILD_OVL_POSITION,
                },
              },
              result.hash
            );
            setTradeConfig({
              showConfirm: false,
              attemptingTransaction: false,
            });
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
              type: TransactionType.BUILD_OVL_POSITION,
            },
          },
          result.hash
        );

        if (receipt.blockNumber) {
          handleTxnHashUpdate(result.hash, Number(receipt.blockNumber));
        }

        if (isSuccess) {
          handleTradeStateReset();
          resetBridge();
        }

        arcxAnalytics?.transaction({
          transactionHash: result.hash,
          account: address,
          chainId,
          metadata: {
            action: TransactionType.BUILD_OVL_POSITION,
          },
        });
      } else {
        console.error("No receipt received after successful wait");
        addPopup(
          {
            txn: {
              hash: result.hash,
              success: false,
              message: "Transaction status unknown. Please check your wallet.",
              type: TransactionType.BUILD_OVL_POSITION,
            },
          },
          result.hash
        );
      }
    } catch (error) {
      console.error("Trade operation failed:", error);

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
      setTradeConfig({
        showConfirm: false,
        attemptingTransaction: false,
      });
    }
  };

  const handleGasModalClose = useCallback(() => {
    console.log("🔋 Gas modal closed by user");
    setShowGasModal(false);
  }, []);

  useEffect(() => {
    if (
      bridgeStage.stage === "success" &&
      !showConfirm &&
      !hasShownTradeModal
    ) {
      console.log("🎯 Bridge success, showing trade confirmation modal");
      setTradeConfig({
        showConfirm: true,
        attemptingTransaction: false,
      });
      setHasShownTradeModal(true);
    } else if (
      bridgeStage.stage === "needs_gas" &&
      !showGasModal &&
      !hasShownGasModal
    ) {
      console.log(
        "🔋 Bridge completed but needs gas, closing confirmation modal and showing gas modal"
      );
      setTradeConfig({
        showConfirm: false, // Close the confirmation modal
        attemptingTransaction: false,
      });
      setShowGasModal(true);
      setHasShownGasModal(true);
    }
  }, [
    bridgeStage,
    showConfirm,
    showGasModal,
    hasShownTradeModal,
    hasShownGasModal,
    attemptingTransaction,
  ]);

  // Reset modal tracking when bridge starts over or goes to idle
  useEffect(() => {
    if (
      bridgeStage.stage === "idle" ||
      bridgeStage.stage === "quote" ||
      bridgeStage.stage === "approval"
    ) {
      setHasShownTradeModal(false);
      setHasShownGasModal(false);
    }
  }, [bridgeStage.stage]);

  const renderDefaultState = () => (
    <>
      {loading && <GradientLoaderButton title={"Trade"} />}

      {address &&
        !loading &&
        tradeState?.tradeState !== TradeState.NeedsApproval &&
        !isApprovalPending && (
          <GradientOutlineButton
            title={tradeButtonConfig.title}
            width={"100%"}
            size={tradeButtonConfig.isDisabledTradeButton ? "14px" : "16px"}
            isDisabled={tradeButtonConfig.isDisabledTradeButton}
            handleClick={() => {
              setTradeConfig({
                showConfirm: true,
                attemptingTransaction: false,
              });
            }}
          />
        )}

      {address &&
        !loading &&
        tradeState &&
        (tradeState.tradeState === TradeState.NeedsApproval ||
          isApprovalPending) &&
        (attemptingTransaction ? (
          <GradientLoaderButton title={"Pending confirmation..."} />
        ) : (
          <GradientOutlineButton
            title={"Approve OVL"}
            width={"100%"}
            handleClick={handleApprove}
          />
        ))}

      {tradeState &&
        (tradeState.tradeState === TradeState.Trade ||
          tradeState.tradeState === TradeState.TradeHighPriceImpact) && (
          <ConfirmTxnModal
            open={showConfirm}
            tradeState={tradeState}
            attemptingTransaction={attemptingTransaction}
            handleDismiss={handleDismiss}
            handleTrade={handleTrade}
          />
        )}
    </>
  );

  const renderSelectedState = () => (
    <>
      {loading && <GradientLoaderButton title={TRADE_WITH_LIFI} />}

      {address && !loading && !isBridging && (
        <GradientOutlineButton
          title={liFiTradeButtonConfig.title}
          width={"100%"}
          size={"16px"}
          isDisabled={liFiTradeButtonConfig.isDisabledTradeButton}
          handleClick={handleLiFiGetBridgeQuote}
        />
      )}

      {address && !loading && isBridging && (
        <GradientLoaderButton
          title={bridgeStage.message || "Getting bridge quote..."}
        />
      )}

      {tradeState && (
        <ConfirmTxnModal
          open={showConfirm}
          tradeState={tradeState}
          bridgeStage={bridgeStage}
          bridgeQuote={bridgeQuote}
          attemptingTransaction={attemptingTransaction}
          handleDismiss={handleDismiss}
          handleBridge={handleBridge}
          handleTrade={handleLiFiTrade}
        />
      )}
    </>
  );

  return (
    <>
      {isDefaultState && renderDefaultState()}
      {isSelectedState && renderSelectedState()}
      {!isDefaultState && !isSelectedState && (
        <>
          {loading && <GradientLoaderButton title={"Trade"} />}

          {!loading &&
            (address ? (
              <GradientOutlineButton
                title={"Select Chain and Token"}
                width={"100%"}
                isDisabled={true}
                size={"14px"}
              />
            ) : (
              <GradientOutlineButton
                title={"Connect Wallet"}
                width={"100%"}
                handleClick={openModal}
              />
            ))}
        </>
      )}

      {/* Gas Modal */}
      {showGasModal && bridgeStage.gasCheckResult && (
        <GetBNBModal
          isOpen={showGasModal}
          onClose={handleGasModalClose}
          gasCheckResult={bridgeStage.gasCheckResult}
          onSkip={proceedAfterGas}
        />
      )}
    </>
  );
};

export default TradeButtonComponent;
