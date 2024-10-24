import {
  GradientLoaderButton,
  GradientOutlineButton,
} from "../../../components/Button";
import useAccount from "../../../hooks/useAccount";
import useSDK from "../../../hooks/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import { useCallback, useMemo, useState } from "react";
import { toWei } from "overlay-sdk";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import ConfirmTxnModal from "./ConfirmTxnModal";
import { TradeStateData } from "../../../types/tradeStateTypes";
import { Address, maxUint256 } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";

type TradeButtonComponentProps = {
  loading: boolean;
  tradeState?: TradeStateData;
};

const TradeButtonComponent: React.FC<TradeButtonComponentProps> = ({
  loading,
  tradeState,
}) => {
  const { address } = useAccount();
  const sdk = useSDK();
  const { open } = useWeb3Modal();
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

  const title: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return tradeState.tradeState;
  }, [tradeState]);

  const isDisabledTradeButton =
    typedValue && !loading && (title === "Trade" || title === "Approve OVL")
      ? false
      : true;

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

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
          handleTxnHashUpdate(result.hash);
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
          handleTradeStateReset();
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

    sdk.ov
      .approve({
        to: market?.id as Address,
        amount: maxUint256,
      })
      .then((result) => {
        handleTxnHashUpdate(result.hash);
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

  const handleError = (error: Error) => {
    const errorString = JSON.stringify(error);
    const errorObj = JSON.parse(errorString);

    const errorCode: number | string =
      errorObj.cause?.cause?.code || errorObj.code;

    let errorMessage =
      errorObj.cause?.shortMessage || errorObj.cause?.cause?.shortMessage;
    return { errorCode, errorMessage };
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

      {address && !loading && tradeState?.tradeState !== "Approve OVL" && (
        <GradientOutlineButton
          title={title ?? "Trade"}
          width={"100%"}
          height={"40px"}
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
        tradeState.tradeState === "Approve OVL" &&
        (attemptingTransaction ? (
          <GradientLoaderButton title={"Pending confirmation..."} />
        ) : (
          <GradientOutlineButton
            title={"Approve OVL"}
            width={"100%"}
            height={"40px"}
            handleClick={handleApprove}
          />
        ))}

      {tradeState && tradeState.tradeState === "Trade" && (
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
          height={"40px"}
          handleClick={handleConnect}
        />
      )}
    </>
  );
};

export default TradeButtonComponent;
