import { createAction } from "@reduxjs/toolkit";

export const updatePowerCardsTxnHash = createAction<{
  txnHash: string;
}>("powercards/updateTxnHash");

export const resetPowerCardsState = createAction<void>("powercards/resetState");
