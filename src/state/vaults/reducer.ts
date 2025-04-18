import { createReducer } from "@reduxjs/toolkit";
import {
  updateUserStats,
  updateVaultsDetails
} from "./actions";
import { UserStats, CalculatedVaultData } from "../../types/vaultTypes";

export interface VaultsState {
  readonly vaultsDetails: CalculatedVaultData[] | undefined;
  readonly userStats: UserStats | undefined;
}

export const initialState: VaultsState = {
  vaultsDetails: undefined,
  userStats: undefined,
};

export default createReducer<VaultsState>(initialState, (builder) =>
  builder
    .addCase(updateVaultsDetails, (state, action) => {
      state.vaultsDetails = action.payload.vaultsDetails;
    })
    .addCase(updateUserStats, (state, action) => {
      state.userStats = action.payload.userStats;
    })
);
