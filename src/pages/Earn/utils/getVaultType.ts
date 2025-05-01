import { VaultItemType, vaultsById } from "../../../constants/vaults";

export type VaultType = 'vaultWithGuard'

export const getVaultType = (vaultId: number): VaultType => {
  const vault = vaultsById[vaultId];

  if (vault.combinationType.includes(VaultItemType.ICHI)) {
    return 'vaultWithGuard';
  }

  throw new Error(`Unsupported vault type for vault: ${vault.vaultName}`);
};