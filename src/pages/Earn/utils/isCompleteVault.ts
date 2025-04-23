import { CalculatedVaultData, PartialVault } from "../../../types/vaultTypes";

export const isCompleteVault = (vault: PartialVault): vault is CalculatedVaultData => {
  return (
    vault.id !== undefined &&
    vault.totalApr !== undefined &&
    vault.stakersCount !== undefined &&
    vault.tvl !== undefined
  );
}