import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { DefaultTxnSettings, resetTradeState, selectLeverage, selectPositionSide, setSlippage, setTxnDeadline, typeInput } from "./actions";

export function useTradeState(): AppState['trade'] {
  return useAppSelector((state) => state.trade);
}

const slippageRegex: RegExp = /^(?:\d{1,2}(?:\.\d{0,2})?|\.\d{1,2}|100(?:\.0{1,2})?)?$/;

export function useTradeActionHandlers(): {
  onAmountInput: (typedValue: string | undefined) => void;
  onSelectLeverage: (selectedLeverage: string) => void;
  onSelectPositionSide: (isLong: boolean) => void;
  onSetSlippage: (slippageValue: DefaultTxnSettings | string) => void;
  onSetTxnDeadline: ( txnDeadline: DefaultTxnSettings | string) => void;
  onResetTradeState: () => void;
} {
  const dispatch = useAppDispatch();

  const onAmountInput = useCallback(
    (typedValue: string | undefined) => {
      dispatch(typeInput({ typedValue }))
    },
    [dispatch]
  );

  const onSelectLeverage = useCallback(
    (selectedLeverage: string) => {
      dispatch(selectLeverage({ selectedLeverage }))
    },
    [dispatch]
  );

  const onSelectPositionSide = useCallback(
    (isLong: boolean) => {
      dispatch(selectPositionSide({ isLong }))
    },
    [dispatch]
  );

  const onSetSlippage = useCallback(
    (slippageValue: DefaultTxnSettings | string) => {
      if (Number(slippageValue) < .01 && slippageValue.length > 3) {
        dispatch(setSlippage({slippageValue: DefaultTxnSettings.DEFAULT_SLIPPAGE}))
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

  const onSetTxnDeadline = useCallback(
    (txnDeadline: DefaultTxnSettings | string) => {
      dispatch(setTxnDeadline({ txnDeadline }))
    },
    [dispatch]
  )

  const onResetTradeState = useCallback(
    () => {
      dispatch(resetTradeState())
    },
    [dispatch]
  )

  return {
    onAmountInput,
    onSelectLeverage,
    onSelectPositionSide,
    onSetSlippage,
    onSetTxnDeadline,
    onResetTradeState
  }
};


export function useDerivedTradeInfo(): {
  tradeData: object | undefined
  inputError?: string
}{
  const account = '';

  const { 
    typedValue,
    selectedLeverage,
    isLong,
    slippageValue,
    txnDeadline
  } = useTradeState();

  let tradeData: object | undefined;

  // if any inputs missing, will not allow buildCallback to be created
  if (typedValue === '' || typedValue === '.' || isLong === null || isLong === undefined) {
    tradeData = undefined;
  } else {
    tradeData = {
      typedValue,
      selectedLeverage,
      isLong,
      slippageValue,
      txnDeadline
    }
  }

  let inputError: string | undefined;
  if (!account) {
    inputError = `Connect Wallet`
  }

  if (typedValue === '' || typedValue === '.') {
    inputError = `Input Collateral Amount`
  }

  if (!selectedLeverage) {
    inputError = `Select Leverage Amount`
  }

  if (isLong === null) {
    inputError = `Select Long or Short Position`
  }

  return {
    tradeData,
    inputError,
  }
}