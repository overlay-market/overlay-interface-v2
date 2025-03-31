import { StakingPool } from "@steerprotocol/sdk";
import { useVaultsState } from "../../../state/vaults/hooks";
import { VaultDetails } from "../../../types/vaultTypes";

export const useCurrentVault = (vaultAddress: string): StakingPool | undefined => {
  const { vaults } = useVaultsState();
  
  return vaults?.find(
    (vault) =>
      vault.stakingPool.toLowerCase() === vaultAddress.toLowerCase()
  )
}

export const useCurrentVaultDetails = (vaultAddress: string): VaultDetails | undefined => {
  const { vaultDetails } = useVaultsState();
  
  return vaultDetails?.find(
    (detail) =>
      detail.vaultAddress.toLowerCase() === vaultAddress.toLowerCase()
  )
}