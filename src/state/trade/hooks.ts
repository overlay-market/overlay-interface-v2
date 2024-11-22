import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { DefaultTxnSettings, resetTradeState, selectLeverage, selectPositionSide, setSlippage, typeInput, updateTxnHash } from "./actions";
import usePrevious from "../../hooks/usePrevious";

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
  handleTxnHashUpdate: (txnHash: string) => void;
  handleTradeStateReset: () => void;
} => {
  const dispatch = useAppDispatch();

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

  const handleTxnHashUpdate = useCallback(
    (txnHash: string) => {
      const timeout = setTimeout(() => {
        dispatch(updateTxnHash({ txnHash }))
      }, 5000);
  
      return () => {
        clearTimeout(timeout);
      };      
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
    handleTxnHashUpdate,
    handleTradeStateReset,
  }
};

export const useIsNewTxnHash = (): boolean => {
  const txnHash = useAppSelector((state) => state.trade.txnHash);
  const previousTxnHash = usePrevious(txnHash)
  
  return txnHash !== '' && txnHash !== previousTxnHash
}