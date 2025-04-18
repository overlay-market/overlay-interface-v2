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
import { handleError } from "../../../utils/handleError";

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

  const handleApprove = async () => {
    if (!typedValue) {
      return;
    }
    setTradeConfig({
      showConfirm,
      attemptingTransaction: true,
    });

    sdk.ovl
      .approve({
        to: market?.id as Address,
        amount: maxUint256,
      })
      .then((result) => {
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
          showConfirm,
          attemptingTransaction: false,
        });
      });
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
        tradeState?.tradeState !== TradeState.NeedsApproval && (
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
        tradeState.tradeState === TradeState.NeedsApproval &&
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
