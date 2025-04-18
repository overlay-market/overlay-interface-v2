import { useVaultsState } from "../../../state/vaults/hooks";
import { CalculatedVaultData, StaticVaultData } from "../../../types/vaultTypes";
import { Address } from "viem";
import { VAULTS } from "../../../constants/vaults";

export const useCurrentVault = (vaultAddress: Address): StaticVaultData | undefined  => {
  
  return VAULTS?.find(
    (vault) =>
      vault.vaultAddress.poolVault.toLowerCase() === vaultAddress.toLowerCase()
  )
}

export const useCurrentVaultDetails = (vaultAddress: Address): CalculatedVaultData | undefined => {
  const { vaultsDetails } = useVaultsState();
  
  return vaultsDetails?.find(
    (detail) =>
      detail.poolVaultAddress.toLowerCase() === vaultAddress.toLowerCase()
  )
}