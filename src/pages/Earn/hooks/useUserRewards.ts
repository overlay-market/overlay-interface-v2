import { useQuery } from '@tanstack/react-query';
import { VaultItemType, vaultsById } from '../../../constants/vaults';
import { MR_types } from '../../../types/vaultTypes';
import { usePublicClient } from 'wagmi';
import { getUserRewardsForMRType } from '../utils/getUserRewardsForMRType';
import { getUserRewardsForERC4626 } from '../utils/getUserRewardsForERC4626';
// import useAccount from '../../../hooks/useAccount';

export const useUserRewards = (curVaultId: number | undefined) => {
  // const { address: account } = useAccount();
const account= '0x1D5b02978d14F9111A685D746d3e360d9e33A541'
  const publicClient = usePublicClient();

  const fetchUserRewards = async (): Promise<string[]> => {
    if (!account || !curVaultId || !publicClient) {
      return [];
    }

    const currentVault = vaultsById[curVaultId];
    if (!currentVault) {
      return [];
    }

    try {
      let rewards: string[] = [];

      const hasMRVault = currentVault.combinationType.some(type =>
        MR_types.includes(type)
      );

      if (hasMRVault) {
        const fetchedRewards = await getUserRewardsForMRType(currentVault.id, account, publicClient);
        rewards = fetchedRewards.filter((r): r is string => typeof r === 'string');
      }

      const hasERC4626 = currentVault.combinationType.includes(VaultItemType.ERC4626);

      if (hasERC4626) {
        const fetchedRewards = await getUserRewardsForERC4626(currentVault.id, account, publicClient);
        rewards = fetchedRewards.filter((r): r is string => typeof r === 'string');
      }

      return rewards;
    } catch (err) {
      console.error('Failed to fetch rewards data:', err);
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const { data: rewards = [], isLoading: loading, error } = useQuery({
    queryKey: ['userRewards', account, curVaultId],
    queryFn: fetchUserRewards,
    enabled: !!account && !!curVaultId && !!publicClient,
    refetchInterval: (data) => {
      if (Array.isArray(data) && data.length === 0) {
        return 1000;
      }
      return false;
    },
  });

  return { rewards, loading, error };
};
