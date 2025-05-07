import { Address, formatEther, getContract, PublicClient } from "viem";
import { getERC4626VaultItemByVaultId } from "./getVaultItem";
import { ERC4626HelperContractABI } from "../abi/ERC4626HelperContractABI";
import { ERC4626HelperContract } from "../../../constants/vaults";
import { formatNumber } from "./formatDecimals";

export const getUserRewardsForERC4626 = async(vaultId: number, account: Address, publicClient: PublicClient): Promise<(string | undefined)[]> => {
  try {
    const currentERC4626Vault = getERC4626VaultItemByVaultId(vaultId);

    if (!currentERC4626Vault) {
      return [];
    }

    const currentERC4626VaultAddress = currentERC4626Vault.vaultAddress;

    const contract = getContract({
      address: ERC4626HelperContract,
      abi: ERC4626HelperContractABI,
      client: publicClient,
    });

    const rawReward = await contract.read.getUserUpdatedEarneds([
      account,
      [currentERC4626VaultAddress]
    ]) as bigint[];

    const amount = Number(formatEther(rawReward[0]));

    let fetchedRewards: string[] = [];

    if (amount > 0) {
      const formatted = formatNumber(amount);
      fetchedRewards.push(`${formatted} ${currentERC4626Vault.rewardTokens[0].rewardTokenName}`);
    }
      
    return fetchedRewards;
  } catch (err) {
    console.error('Failed to fetch rewards', err);
    return [];
  }
}