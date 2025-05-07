import { gql, request } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
import { FetchedIchiVaultData } from "../../../types/vaultTypes";
import { BERA_VAULTS_SUBGRAPH_URL, VAULT_ITEMS, VaultItemType } from "../../../constants/vaults";

const document = gql`
 query MyQuery($vaultId: String!) {
   ichiVault(id: $vaultId) {
      feeApr_7d
      holdersCount
      totalAmount0
      totalAmount1
      token0
      token1
    }
  }
`;

export const useFetchIchiVaultsData = () => {
  const [fetchedIchiVaultsData, setFetchedIchiVaultsData] = useState<FetchedIchiVaultData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVaultsInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const newVaultsData = await Promise.all(
          VAULT_ITEMS.filter(vault => vault.vaultType === VaultItemType.ICHI).map(async (vault) => {
            try {
              const data: { ichiVault: Omit<FetchedIchiVaultData, "id"> } = await request(
                BERA_VAULTS_SUBGRAPH_URL,
                document,
                { vaultId: vault.vaultAddress.toLowerCase() }
              );
              
              return {
                id: vault.id,
                ...data.ichiVault
              }
            } catch (err) {
              console.error(`Error fetching vault ${vault.vaultAddress}:`, err);
              return undefined;
            }
          })
        );

        const filteredData = newVaultsData.filter(
          (data): data is FetchedIchiVaultData => data !== undefined
        );
        setFetchedIchiVaultsData(filteredData);
      } catch (err) {
        console.error('Failed to fetch vaults data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchVaultsInfo();
  }, []); 

  const result = useMemo(() => {
    return { fetchedIchiVaultsData, loading, error };
  }, [fetchedIchiVaultsData, loading, error]);

  return result;
}