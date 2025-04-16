import { createReducer } from "@reduxjs/toolkit";
import {
  updateUserStats,
  updateVaults, updateVaultsDetails
} from "./actions";
import { StakingPool } from "@steerprotocol/sdk";
import { UserStats, CalculatedVaultData } from "../../types/vaultTypes";

export interface VaultsState {
  readonly vaults: StakingPool[] | undefined;
  readonly vaultsDetails: CalculatedVaultData[] | undefined;
  readonly userStats: UserStats | undefined;
}

export const initialState: VaultsState = {
  vaults: undefined,
  vaultsDetails: undefined,
  userStats: undefined,
};

export default createReducer<VaultsState>(initialState, (builder) =>
  builder
    .addCase(updateVaults, (state, action) => {
      state.vaults = action.payload.vaults;
    })
    .addCase(updateVaultsDetails, (state, action) => {
      state.vaultsDetails = action.payload.vaultsDetails;
    })
    .addCase(updateUserStats, (state, action) => {
      state.userStats = action.payload.userStats;
    })
);
