import { StakingPool } from "@steerprotocol/sdk";
import { createContext } from "react";
import { CalculatedVaultData } from "../../types/vaultTypes";

type VaultsContextType = {
  // vaults: StakingPool[] | undefined; // Vault list (or null if not loaded yet)
  vaultsDetails: CalculatedVaultData[] | undefined;
}

export const VaultsContext = createContext<VaultsContextType>({
  // vaults: undefined,
  vaultsDetails: undefined,
})