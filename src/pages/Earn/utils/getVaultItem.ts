import { VAULT_ITEMS, VaultItemType, vaultsById } from "../../../constants/vaults"
import { MR_types } from "../../../types/vaultTypes"

export const getIchiVaultItemByVaultId = ( vaultId: number) => {
  return (
    VAULT_ITEMS.find(
      (vt) => vaultsById[vaultId].vaultItems.includes(vt.id) && vt.vaultType === VaultItemType.ICHI
    )
  )
}

export const getMRVaultItemByVaultId = ( vaultId: number) => {
  return (
    VAULT_ITEMS.find(
      (vt) => vaultsById[vaultId].vaultItems.includes(vt.id) && MR_types.includes(vt.vaultType)
    )
  )
}

export const getERC4626VaultItemByVaultId = ( vaultId: number) => {
  return (
    VAULT_ITEMS.find(
      (vt) => vaultsById[vaultId].vaultItems.includes(vt.id) && vt.vaultType === VaultItemType.ERC4626
    )
  )
}
