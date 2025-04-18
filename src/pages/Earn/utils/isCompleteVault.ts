import { CalculatedVaultData, PartialVault } from "../../../types/vaultTypes";

export const isCompleteVault = (vault: PartialVault): vault is CalculatedVaultData => {
  return (
    vault.poolVaultAddress !== undefined &&
    vault.poolApr !== undefined &&
    vault.rewardsApr !== undefined &&
    vault.totalApr !== undefined &&
    vault.stakersCount !== undefined &&
    vault.tvl !== undefined
  );
}