import { useEffect, useState } from 'react';
import { getContract, formatEther } from 'viem';
import { vaultItemsById, vaultsById } from '../../../constants/vaults';
import { MR_types } from '../../../types/vaultTypes';
import { rewardsVaultABI } from '../abi/rewardsVaultABI';
import { usePublicClient } from 'wagmi';
// import useAccount from '../../../hooks/useAccount';

export const useUserRewards = (curVaultId: number | undefined) => {
  // const { address: account } = useAccount();
  const account = `0x9A45122d496983bdfDE3aE464C92b4610ad690fE`
  const publicClient = usePublicClient();
  
  const [rewards, setRewards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!account || !curVaultId || !publicClient) return;
      
      const vault = vaultsById[curVaultId];
      if (!vault) return;

      const hasMRVault = vault.combinationType.some(type =>
        MR_types.includes(type)
      );

      if (!hasMRVault) return;

      const mrVaultItemId = vault.vaultItems.find(vaultId =>
        MR_types.includes(vaultItemsById[vaultId].vaultType)
      );

      if (!mrVaultItemId) return;

      const mrVaultItem = vaultItemsById[mrVaultItemId];
      const contract = getContract({
        address: mrVaultItem.vaultAddress,
        abi: rewardsVaultABI,
        client: publicClient,
      });

      setLoading(true);
      try {
        const fetchedRewards = await Promise.all(
          mrVaultItem.rewardTokens.map(async (token) => {
            const earned = await contract.read.earned([
              account,
              token.rewardTokenAddress,
            ]) as bigint;

            const amount = Number(formatEther(earned));
            if (amount > 0) {
              return `${amount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} ${token.rewardTokenName}`;
            }
          })
        );
        setRewards(fetchedRewards.filter((r): r is string => typeof r === 'string'));
      } catch (err) {
        console.error('Failed to fetch rewards', err);
        setRewards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [curVaultId, account]);

  return { rewards, loading };
};
