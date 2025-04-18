import { FetchedVaultData, PartialVault } from "../../../types/vaultTypes";

export const  initializeVaults = (fetchedVaults: FetchedVaultData[]): PartialVault[] => {
  return fetchedVaults.map((vault) => ({
    poolVaultAddress: vault.id,
    poolApr: vault.feeApr_7d,
    stakersCount: vault.holdersCount,
  }));
}