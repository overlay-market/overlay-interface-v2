import { usePublicClient, useWalletClient } from "wagmi";
import useAccount from "../../../hooks/useAccount";
import { useTransaction } from "./useTransaction";
import { TransactionType } from "../../../constants/transaction";
import { ERC4626ABI } from "../abi/ERC4626ABI";
import { getERC4626VaultItemByVaultId, getMRVaultItemByVaultId } from "../utils/getVaultItem";
import { useQueryClient } from "@tanstack/react-query";

export const useClaimRewards = (vaultId: number) => {
  const { address: account, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();
  
  const { sendTransaction, loading, txHash, error } = useTransaction(
    {
      type: TransactionType.CLAIM_REWARDS,
      successMessage: 'Successfully claimed rewards!',
    }  
  );

  const ERC4626Vault = getERC4626VaultItemByVaultId(vaultId);
  const MrVault = getMRVaultItemByVaultId(vaultId);

  const handleClaimRewardsForERC4626 = async () => {
    if (!account || !walletClient || !publicClient || !isConnected || !ERC4626Vault) return;

    try {
      const chain = walletClient.chain;
      const vaultAddress = ERC4626Vault.vaultAddress;

      await sendTransaction({
        address: vaultAddress,
        abi: ERC4626ABI,
        functionName: 'getReward',
        args: [], 
        account,
        chain: chain, 
      });

      if (!txHash) throw new Error('getReward tx failed');

      if (txHash) {
        await queryClient.refetchQueries({
          queryKey: ['userRewards', account, vaultId],
          exact: true,
        });
      }

    } catch (err) {
      console.error('Claim rewards error:', err);
    }
  };

  const handleClaimRewardsForMrVault = async () => {}

  const handleClaimRewards = async () => {
    if (!ERC4626Vault && !MrVault) {
      console.error('No valid vault found for vaultId:', vaultId);
      return;
    }

    if (ERC4626Vault) {
      await handleClaimRewardsForERC4626();
    } else if (MrVault) {
      await handleClaimRewardsForMrVault();
    }
  };

  return {
    handleClaimRewards,
    loading,
    txHash,
    error,
  };
};