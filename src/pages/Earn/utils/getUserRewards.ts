import { createPublicClient, formatEther, getContract, http } from "viem";
import { berachain } from "viem/chains";
import {rewardsVaultABI} from '../abi/rewardsVaultABI'
import { MR_types } from "../../../types/vaultTypes";
import { vaultItemsById, vaultsById } from "../../../constants/vaults";
// import useAccount from "../../../hooks/useAccount";

const publicClient = createPublicClient({
  chain: berachain,
  transport: http(),
});

export const getUserRewards = async(
  curVaultId: number
): Promise<string[]> => {
  // const { address: account } = useAccount();
  const account = `0x9A45122d496983bdfDE3aE464C92b4610ad690fE`
  const hasMRVault = vaultsById[curVaultId].combinationType.some(type => MR_types.includes(type));
  
  if (!hasMRVault) return []

  const mrVaultItemId = vaultsById[curVaultId].vaultItems.find(vaultId => MR_types.includes(vaultItemsById[vaultId].vaultType)) 

  if (mrVaultItemId) {
    const contract = getContract({
      address: vaultItemsById[mrVaultItemId].vaultAddress,
      abi: rewardsVaultABI,
      client: publicClient,
    });

    const rewards = await Promise.all(
      vaultItemsById[mrVaultItemId].rewardTokens.map(async (token) => {
        const earned = await contract.read.earned([
          account,
          token.rewardTokenAddress,
        ]) as bigint;
  
        return `${Number(formatEther(earned)).toLocaleString(undefined,  {
          maximumFractionDigits: 2,
        })} ${token.rewardTokenName}`;
      })
    );
  
    return rewards;  
  }  

  return []
};