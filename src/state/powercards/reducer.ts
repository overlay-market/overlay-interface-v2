import { createReducer } from "@reduxjs/toolkit";
import { updatePowerCardsTxnHash, resetPowerCardsState } from "./actions";

export interface PowerCardsState {
  readonly txnHash: string;
}

const initialState: PowerCardsState = {
  txnHash: "",
};

export default createReducer<PowerCardsState>(initialState, (builder) =>
  builder
    .addCase(updatePowerCardsTxnHash, (state, { payload: { txnHash } }) => {
      state.txnHash = txnHash;
    })
    .addCase(resetPowerCardsState, () => initialState)
);
