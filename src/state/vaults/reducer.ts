import { createReducer } from "@reduxjs/toolkit";
import {
  updateVaults, updateVaultsDetails
} from "./actions";
import { StakingPool } from "@steerprotocol/sdk";
import { VaultDetails } from "../../types/vaultTypes";

export interface VaultsState {
  readonly vaults: StakingPool[] | undefined;
  readonly vaultDetails: VaultDetails[] | undefined;
}

export const initialState: VaultsState = {
  vaults: undefined,
  vaultDetails: undefined,
};

export default createReducer<VaultsState>(initialState, (builder) =>
  builder
    .addCase(updateVaults, (state, action) => {
      state.vaults = action.payload.vaults;
    })
    .addCase(updateVaultsDetails, (state, action) => {
      state.vaultDetails = action.payload.vaultDetails;
    })
);
