import { VAULT_ITEMS, VaultItemType, vaultsById } from "../../../constants/vaults"

export const getIchiVaultItemByVaultId = ( vaultId: number) => {
  return (
    VAULT_ITEMS.find(
      (vt) => vaultsById[vaultId].vaultItems.includes(vt.id) && vt.vaultType === VaultItemType.ICHI
    )
  )
}