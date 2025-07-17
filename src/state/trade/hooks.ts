import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { DefaultTxnSettings, resetTradeState, selectChain, selectLeverage, selectPositionSide, selectToken, setSlippage, typeInput, updateTxnHash } from "./actions";
import usePrevious from "../../hooks/usePrevious";
import useSDK from "../../providers/SDKProvider/useSDK";
import { TokenAmount } from "@lifi/sdk";
import { serializeWithBigInt } from "../../utils/serializeWithBigInt";

export const MINIMUM_SLIPPAGE_VALUE = 0.05;

export function useTradeState(): AppState['trade'] {
  return useAppSelector((state) => state.trade);
}

const slippageRegex: RegExp = /^(?:\d{1,2}(?:\.\d{0,2})?|\.\d{1,2}|100(?:\.0{1,2})?)?$/;

export const useTradeActionHandlers = (): {
  handleAmountInput: (typedValue: string) => void;
  handleLeverageSelect: (selectedLeverage: string) => void;
  handlePositionSideSelect: (isLong: boolean) => void;
  handleSlippageSet: (slippageValue: DefaultTxnSettings | string) => void;
  handleTxnHashUpdate: (txnHash: string, txnBlockNumber: number) => void;
  handleChainSelect: (selectedChainId: number) => void;
  handleTokenSelect: (selectedToken: TokenAmount) => void;
  handleTradeStateReset: () => void;
} => {
  const dispatch = useAppDispatch();
  const sdk = useSDK();

  const handleAmountInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }))
    },
    [dispatch]
  );

  const handleLeverageSelect = useCallback(
    (selectedLeverage: string) => {
      dispatch(selectLeverage({ selectedLeverage }))
    },
    [dispatch]
  );

  const handlePositionSideSelect = useCallback(
    (isLong: boolean) => {
      dispatch(selectPositionSide({ isLong }))
    },
    [dispatch]
  );

  const handleSlippageSet = useCallback(
    (slippageValue: DefaultTxnSettings | string) => {
      if (Number(slippageValue) < MINIMUM_SLIPPAGE_VALUE && slippageValue.length > 3) {
        dispatch(setSlippage({slippageValue: MINIMUM_SLIPPAGE_VALUE.toString()}))
      }
      if(slippageValue === '.') {
        dispatch(setSlippage({ slippageValue }))
      }
      if(slippageRegex.test(slippageValue)) {
        dispatch(setSlippage({ slippageValue }))
      }

      localStorage.setItem(`slippage`, slippageValue ?? DefaultTxnSettings.DEFAULT_SLIPPAGE)
    },
    [dispatch]
  )

  const handleChainSelect = useCallback(
    (selectedChainId: number) => {
      dispatch(selectChain({ selectedChainId }));
      localStorage.setItem('lifiSelectedChainId', selectedChainId.toString());
    },
    [dispatch]
  );

  const handleTokenSelect = useCallback(
    (selectedToken: TokenAmount) => {
      dispatch(selectToken({ selectedToken }));
      localStorage.setItem('lifiSelectedToken', serializeWithBigInt(selectedToken));
    },
    [dispatch]
  );

  const handleTxnHashUpdate =  useCallback(
    async (txnHash: string, txnBlockNumber: number) => {
      const checkSubgraphBlock = async () => {
        const lastSubgraphBlock = await sdk.core.getLastSubgraphProcessedBlock();

        if (lastSubgraphBlock > txnBlockNumber) {
          dispatch(updateTxnHash({ txnHash }));
        } else {
          setTimeout(checkSubgraphBlock, 1000);
        }
      };
  
      checkSubgraphBlock();          
    },
    [dispatch]
  );

  const handleTradeStateReset = useCallback(
    () => {
      dispatch(resetTradeState())
    },
    [dispatch]
  )

  return {
    handleAmountInput,
    handleLeverageSelect,
    handlePositionSideSelect,
    handleSlippageSet,
    handleChainSelect,
    handleTokenSelect,
    handleTxnHashUpdate,
    handleTradeStateReset,
  }
};

export const useIsNewTxnHash = (): boolean => {
  const txnHash = useAppSelector((state) => state.trade.txnHash);
  const previousTxnHash = usePrevious(txnHash)
  
  return txnHash !== '' && txnHash !== previousTxnHash
}