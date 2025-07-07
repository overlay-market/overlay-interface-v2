import { VaultItemType, vaultsById } from "../../../constants/vaults";
import { MR_types } from "../../../types/vaultTypes";

export type VaultConfig = 'ichiPlusErc4626' | 'ichiPlusMR';

export const getVaultConfig = (vaultId: number): VaultConfig => {
  const vault = vaultsById[vaultId];

  const hasICHI = vault.combinationType.includes(VaultItemType.ICHI);
  const hasERC4626 = vault.combinationType.includes(VaultItemType.ERC4626);
  const hasMR = vault.combinationType.some(type => MR_types.includes(type));

  if (hasICHI && hasERC4626) {
    return 'ichiPlusErc4626';
  }

  if (hasICHI && hasMR) {
    return 'ichiPlusMR';
  }

  throw new Error(`Unsupported vault config for vault: ${vault.vaultName}`);
};