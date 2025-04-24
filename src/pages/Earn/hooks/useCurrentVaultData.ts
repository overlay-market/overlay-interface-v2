import { useVaultsState } from "../../../state/vaults/hooks";
import { CalculatedVaultData, MR_types, StaticVaultData, VaultItem } from "../../../types/vaultTypes";
import { VAULT_ITEMS, VAULTS } from "../../../constants/vaults";

export const useCurrentVault = (vaultName: string | undefined): StaticVaultData | undefined  => {
  if (!vaultName) return undefined;

  return VAULTS?.find(
    (vault) =>
      vault.vaultName.toLowerCase() === vaultName.toLowerCase()
  )
}

export const useCurrentVaultDetails = (vaultId: number | undefined): CalculatedVaultData | undefined => {
  const { vaultsDetails } = useVaultsState();
  if (!vaultId) return undefined;

  return vaultsDetails?.find(
    (detail) =>
      detail.id === vaultId
  )
}

export const useCurrentMRVault = (vault: StaticVaultData): VaultItem | undefined  => {
  if (!vault) return undefined;

  return VAULT_ITEMS.find(
    (vt) => vault.vaultItems.includes(vt.id) && MR_types.includes(vt.vaultType)
  )
}