import { createContext } from "react";
import { CalculatedVaultData } from "../../types/vaultTypes";

type VaultsContextType = {
  vaultsDetails: CalculatedVaultData[] | undefined;
}

export const VaultsContext = createContext<VaultsContextType>({
  vaultsDetails: undefined,
})