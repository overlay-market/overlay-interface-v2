import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { DefaultTxnSettings, resetTradeState, selectLeverage, selectPositionSide, setSlippage, setTxnDeadline, typeInput } from "./actions";

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
  handleTxnDeadlineSet: ( txnDeadline: DefaultTxnSettings | string) => void;
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

  const handleTxnDeadlineSet = useCallback(
    (txnDeadline: DefaultTxnSettings | string) => {
      dispatch(setTxnDeadline({ txnDeadline }))
    },
    [dispatch]
  )

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
    handleTxnDeadlineSet,
    handleTradeStateReset,
  }
};


export const useDerivedTradeInfo = (): {
  tradeData: object | undefined
  inputError?: string
} => {
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