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

const TRADE_WITH_LIFI = "Bridge & Trade";

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
  const { currentMarket: market } = useCurrentMarketState();
  const { handleTradeStateReset, handleTxnHashUpdate } =
    useTradeActionHandlers();
  const { typedValue, selectedLeverage, isLong } = useTradeState();
  const { chainState, tokenState } = useChainAndTokenState();
  const {
    executeBridge,
    bridgeStage,
    resetBridge,
    bridgedAmount,
    bridgeQuote,
    isBridging,
    getBridgeQuote,
  } = useLiFiBridge();
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
  const arcxAnalytics = useArcxAnalytics();
  const { maxInputIncludingFees } = useMaxInputIncludingFees({
    marketId: market?.marketId,
  });

  const { data: riskParamsData } = useRiskParamsQuery({
    marketId: market?.id,
  });

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
    if (market && tradeState) {
      setTradeConfig({
        showConfirm,
        attemptingTransaction: true,
      });

      sdk.market
        .build({
          account: address,
          marketAddress: market?.id as Address,
          collateral: toWei(typedValue),
          leverage: toWei(selectedLeverage),
          isLong,
          priceLimit: toWei(tradeState.priceInfo.minPrice as string),
        })
        .then((result) => {
          addPopup(
            {
              txn: {
                hash: result.hash,
                success: result.receipt?.status === "success",
                message: "",
                type: TransactionType.BUILD_OVL_POSITION,
              },
            },
            result.hash
          );
          handleTxnHashUpdate(result.hash, Number(result.receipt?.blockNumber));
          handleTradeStateReset();
          arcxAnalytics?.transaction({
            transactionHash: result.hash,
            account: address,
            chainId,
            metadata: {
              action: TransactionType.BUILD_OVL_POSITION,
            },
          });
        })
        .catch((error: Error) => {
          const { errorCode, errorMessage } = handleError(error);

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
        })
        .finally(() => {
          setTradeConfig({
            showConfirm: false,
            attemptingTransaction: false,
          });
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

  const handleApprove = async () => {
    if (!typedValue) {
      return;
    }
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

      addPopup({
        txn: {
          hash: result.hash,
          success: result.receipt?.status === "success",
          message: "",
          type: TransactionType.APPROVAL,
        },
      });

      handleTxnHashUpdate(result.hash, Number(result.receipt?.blockNumber));

      const isUpdated = await waitForTradeStateUpdate();
      setIsApprovalPending(isUpdated);
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

    setTradeConfig({
      showConfirm,
      attemptingTransaction: true,
    });

    const collateralAmount = BigInt(bridgedAmount);

    console.log("🏗️ Building position with:", {
      bridgedAmount: bridgedAmount,
      bridgedAmountReadable: (Number(bridgedAmount) / 1e18).toFixed(6),
      collateralAmount: collateralAmount.toString(),
      collateralReadable: (Number(collateralAmount) / 1e18).toFixed(6),
      leverage: selectedLeverage,
      dataType: typeof bridgedAmount,
      minCollateralRequired: minCollateral,
    });

    sdk.market
      .build({
        account: address,
        marketAddress: market?.id as Address,
        collateral: collateralAmount,
        leverage: toWei(selectedLeverage),
        isLong,
        priceLimit: toWei(tradeState.priceInfo.minPrice as string),
      })
      .then((result) => {
        addPopup(
          {
            txn: {
              hash: result.hash,
              success: result.receipt?.status === "success",
              message: "",
              type: TransactionType.BUILD_OVL_POSITION,
            },
          },
          result.hash
        );
        handleTxnHashUpdate(result.hash, Number(result.receipt?.blockNumber));
        handleTradeStateReset();
        arcxAnalytics?.transaction({
          transactionHash: result.hash,
          account: address,
          chainId,
          metadata: {
            action: TransactionType.BUILD_OVL_POSITION,
          },
        });
        resetBridge();
      })
      .catch((error: Error) => {
        const { errorCode, errorMessage } = handleError(error);

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
      })
      .finally(() => {
        setTradeConfig({
          showConfirm: false,
          attemptingTransaction: false,
        });
      });
  };

  useEffect(() => {
    if (bridgeStage.stage === "success" && !showConfirm) {
      setTradeConfig({
        showConfirm: true,
        attemptingTransaction,
      });
    }
  }, [bridgeStage]);

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
    </>
  );
};

export default TradeButtonComponent;
