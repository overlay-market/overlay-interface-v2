import { gql, request } from "graphql-request";
import { useEffect, useState } from "react";
import { FetchedVaultData } from "../../../types/vaultTypes";
import { BERA_VAULTS_SUBGRAPH_URL, VAULTS } from "../../../constants/vaults";

const document = gql`
 query MyQuery($vaultId: String!) {
   ichiVault(id: $vaultId) {
      id
      feeApr_7d
      holdersCount
      totalAmount0
      totalAmount1
      token0
      token1
    }
  }
`;

export const useFetchVaultsData = () => {
  const [fetchedVaultsData, setFetchedVaultsData] = useState<FetchedVaultData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVaultsDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const newVaultsData = await Promise.all(
          VAULTS.map(async (vault) => {
            try {
              const data: { ichiVault: FetchedVaultData } = await request(
                BERA_VAULTS_SUBGRAPH_URL,
                document,
                { vaultId: vault.vaultAddress.poolVault.toLowerCase() }
              );
              return data.ichiVault;
            } catch (err) {
              console.error(`Error fetching vault ${vault.vaultAddress.poolVault}:`, err);
              return undefined;
            }
          })
        );

        const filteredData = newVaultsData.filter(
          (data): data is FetchedVaultData => data !== undefined
        );
        setFetchedVaultsData(filteredData);
      } catch (err) {
        console.error('Failed to fetch vaults data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchVaultsDetails();
  }, []); 

  return { fetchedVaultsData, loading, error };
}