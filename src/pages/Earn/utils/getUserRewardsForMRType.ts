import { Address, formatEther, getContract, PublicClient } from "viem";
import { getMRVaultItemByVaultId } from "./getVaultItem";
import { rewardsVaultABI } from "../abi/rewardsVaultABI";

export const getUserRewardsForMRType = async(vaultId: number, account: Address, publicClient: PublicClient): Promise<(string | undefined)[]> => {
  try {
    const currentMRVault = getMRVaultItemByVaultId(vaultId);

    if (!currentMRVault) {
      return [];
    }

    const contract = getContract({
      address: currentMRVault.vaultAddress,
      abi: rewardsVaultABI,
      client: publicClient,
    });

    const fetchedRewards = await Promise.all(
      currentMRVault.rewardTokens.map(async (token) => {
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
    
    return fetchedRewards;
  } catch (err) {
    console.error('Failed to fetch rewards', err);
    return [];
  }
}