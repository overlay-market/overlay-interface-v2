import { VaultItemType, vaultsById } from "../../../constants/vaults";

export type VaultType = 'vaultWithGuardAndERC4626'

export const getVaultType = (vaultId: number): VaultType => {
  const vault = vaultsById[vaultId];

  if (vault.combinationType.includes(VaultItemType.ICHI) && vault.combinationType.includes(VaultItemType.ERC4626)) {
    return 'vaultWithGuardAndERC4626';
  }

  throw new Error(`Unsupported vault type for vault: ${vault.vaultName}`);
};