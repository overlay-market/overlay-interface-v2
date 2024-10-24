import { createReducer } from "@reduxjs/toolkit";
import {
  DefaultTxnSettings,
  typeInput,
  selectLeverage,
  selectPositionSide,
  setSlippage,
  updateTxnHash,
  resetTradeState
} from "./actions";

export interface TradeState {
  readonly typedValue: string;
  readonly selectedLeverage: string;
  readonly isLong: boolean;
  readonly slippageValue: DefaultTxnSettings | string;
  readonly txnHash: string;
  readonly previousTxnHash: string;
}

export const initialState: TradeState = {
  typedValue: "",
  selectedLeverage: "1",
  isLong: true,
  slippageValue: "1",
  txnHash: '',
  previousTxnHash: '',
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
    .addCase(updateTxnHash, (state, action) => {
      state.previousTxnHash = state.txnHash;
      state.txnHash = action.payload.txnHash;
    })
    .addCase(resetTradeState, (state) => {
      state.typedValue = initialState.typedValue;
      state.selectedLeverage = initialState.selectedLeverage;
      state.isLong = initialState.isLong;
    })
);
