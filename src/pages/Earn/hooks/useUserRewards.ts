import { useEffect, useState } from 'react';
import { VaultItemType, vaultsById } from '../../../constants/vaults';
import { MR_types } from '../../../types/vaultTypes';
import { usePublicClient } from 'wagmi';
import { getUserRewardsForMRType } from '../utils/getUserRewardsForMRType';
import { getUserRewardsForERC4626 } from '../utils/getUserRewardsForERC4626';
import useAccount from '../../../hooks/useAccount';

export const useUserRewards = (curVaultId: number | undefined) => {
  const { address: account } = useAccount();

  const publicClient = usePublicClient();
  
  const [rewards, setRewards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!account || !curVaultId || !publicClient) return;
      
      const currentVault = vaultsById[curVaultId];
      if (!currentVault) return;

      setLoading(true);
      const hasMRVault = currentVault.combinationType.some(type =>
        MR_types.includes(type)
      );

      if (hasMRVault) {
        const fetchedRewards = await getUserRewardsForMRType(currentVault.id, account, publicClient);
        setRewards(fetchedRewards.filter((r): r is string => typeof r === 'string'));
      }

      const hasERC4626 = currentVault.combinationType.includes(VaultItemType.ERC4626);
 
      if (hasERC4626) {
        const fetchedRewards = await getUserRewardsForERC4626(currentVault.id, account, publicClient);
        setRewards(fetchedRewards.filter((r): r is string => typeof r === 'string'));
      }

      setLoading(false);      
    };

    fetchRewards();
  }, [curVaultId, account, publicClient]);

  return { rewards, loading };
};
