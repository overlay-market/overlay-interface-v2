import { createReducer } from "@reduxjs/toolkit";
import {
  DefaultTxnSettings,
  typeInput,
  selectLeverage,
  selectPositionSide,
  setSlippage,
  setTxnDeadline,
  resetTradeState
} from "./actions";

export interface TradeState {
  readonly typedValue: string | undefined;
  readonly selectedLeverage: string;
  readonly isLong: boolean | undefined;
  readonly slippageValue: DefaultTxnSettings | string;
  readonly txnDeadline: DefaultTxnSettings | string;
}

export const initialState: TradeState = {
  typedValue: "",
  selectedLeverage: "1",
  isLong: true,
  slippageValue: "1",
  txnDeadline: "30",
};

export default createReducer<TradeState>(initialState, (builder) =>
  builder
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      state.typedValue = typedValue;
    })
    .addCase(selectLeverage, (state, { payload: { selectedLeverage } }) => {
      state.selectedLeverage = selectedLeverage;
    })
    .addCase(selectPositionSide, (state, { payload: { isLong } }) => {
      state.isLong = isLong;
    })
    .addCase(setSlippage, (state, action) => {
      state.slippageValue = action.payload.slippageValue;
    })
    .addCase(setTxnDeadline, (state, { payload: { txnDeadline } }) => {
      state.txnDeadline = txnDeadline;
    })
    .addCase(resetTradeState, (state) => {
      state.typedValue = initialState.typedValue;
      state.selectedLeverage = initialState.selectedLeverage;
      state.isLong = initialState.isLong;
      // Avoid resetting slippage value
      // state.slippageValue = initialState.slippageValue;
      state.txnDeadline = initialState.txnDeadline;
    })
);
