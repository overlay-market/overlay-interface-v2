import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface PowerCardsState {
  readonly txnHash: string;
}

const initialState: PowerCardsState = {
  txnHash: "",
};

export const powercardsSlice = createSlice({
  name: "powercards",
  initialState,
  reducers: {
    updateTxnHash: (state, action: PayloadAction<string>) => {
      state.txnHash = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { updateTxnHash, resetState } = powercardsSlice.actions;
export const selectPowerCards = (state: RootState) => state.powercards;
export default powercardsSlice.reducer;
