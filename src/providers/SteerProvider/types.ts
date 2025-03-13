import { StakingPool } from "@steerprotocol/sdk";
import { createContext } from "react";
import { VaultDetails } from "../../types/vaultTypes";

type SteerContextType = {
  vaults: StakingPool[] | undefined; // Vault list (or null if not loaded yet)
  vaultDetails: VaultDetails[] | undefined;
}

export const SteerContext = createContext<SteerContextType>({
  vaults: undefined,
  vaultDetails: undefined,
})