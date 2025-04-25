import { createReducer } from "@reduxjs/toolkit";
import {
  updateVaultsDetails
} from "./actions";
import { CalculatedVaultData } from "../../types/vaultTypes";

export interface VaultsState {
  readonly vaultsDetails: CalculatedVaultData[] | undefined;
}

export const initialState: VaultsState = {
  vaultsDetails: undefined,
};

export default createReducer<VaultsState>(initialState, (builder) =>
  builder
    .addCase(updateVaultsDetails, (state, action) => {
      state.vaultsDetails = action.payload.vaultsDetails;
    })
);
