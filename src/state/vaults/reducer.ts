import { createReducer } from "@reduxjs/toolkit";
import {
  DefaultTxnSettings,
  setSlippage,
  updateVaultsDetails
} from "./actions";
import { CalculatedVaultData } from "../../types/vaultTypes";

export interface VaultsState {
  readonly vaultsDetails: CalculatedVaultData[] | undefined;
  readonly slippageValue: DefaultTxnSettings | string;
}

export const initialState: VaultsState = {
  vaultsDetails: undefined,
  slippageValue: "1",
};

export default createReducer<VaultsState>(initialState, (builder) =>
  builder
    .addCase(updateVaultsDetails, (state, action) => {
      state.vaultsDetails = action.payload.vaultsDetails;
    })
    .addCase(setSlippage, (state, action) => {
      state.slippageValue = action.payload.slippageValue;
    })
);
