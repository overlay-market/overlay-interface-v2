import {
  GradientLoaderButton,
  GradientOutlineButton,
} from "../../../components/Button";
import useAccount from "../../../hooks/useAccount";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import { useCallback, useMemo, useState } from "react";
import { toWei, TradeState, TradeStateData } from "overlay-sdk";
import ConfirmTxnModal from "./ConfirmTxnModal";
import { Address, maxUint256 } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";
import { useModalHelper } from "../../../components/ConnectWalletModal/utils";
import { useArcxAnalytics } from "@0xarc-io/analytics";

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
  const title: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return tradeState.tradeState;
  }, [tradeState]);

  const isDisabledTradeButton =
    typedValue &&
    !loading &&
    (title === TradeState.Trade ||
      title === TradeState.NeedsApproval ||
      title === TradeState.TradeHighPriceImpact)
      ? false
      : true;

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
      const result = await sdk.shiva.approveShiva({
        account: address,
        amount: maxUint256,
      });

      addPopup(
        {
          txn: {
            hash: result.hash,
            success: result.receipt?.status === "success",
            message: "",
            type: TransactionType.APPROVAL,
          },
        },
        result.hash
      );

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

  return (
    <>
      {loading && <GradientLoaderButton title={"Trade"} />}

      {address &&
        !loading &&
        tradeState?.tradeState !== TradeState.NeedsApproval &&
        !isApprovalPending && (
          <GradientOutlineButton
            title={title ?? "Trade"}
            width={"100%"}
            size={isDisabledTradeButton ? "14px" : "16px"}
            isDisabled={isDisabledTradeButton}
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

      {!address && (
        <GradientOutlineButton
          title={"Connect Wallet"}
          width={"100%"}
          handleClick={openModal}
        />
      )}
    </>
  );
};

export default TradeButtonComponent;
