import { vaultsById } from "../../../constants/vaults";
import { FetchedIchiVaultData, PartialVault} from "../../../types/vaultTypes";

export const initializeVaults = <T>(
  staticVaultsIds: number[],
  fetchedVaults: T[],
  mapper: (vaultId: number, fetchedVaults: T[]) => PartialVault
): PartialVault[] => {
  return staticVaultsIds.map(vaultId => mapper(vaultId, fetchedVaults));
};

export const mapperWithIchi = (vaultId: number, fetchedVaults: FetchedIchiVaultData[]): PartialVault => {
  const fetchedIchiVault = fetchedVaults.find(v =>
    vaultsById[vaultId]?.vaultItems.includes(v.id)
  );
  return {
    id: vaultId,
    ichiApr: fetchedIchiVault?.feeApr_7d,
    stakersCount: fetchedIchiVault?.holdersCount,
  }
};