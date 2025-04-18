import { createPublicClient, formatEther, getContract, http } from "viem";
import { berachain } from "viem/chains";
import {rewardsVaultABI} from '../abi/rewardsVaultABI'
import { StaticVaultData } from "../../../types/vaultTypes";
// import useAccount from "../../../hooks/useAccount";

const publicClient = createPublicClient({
  chain: berachain,
  transport: http(),
});

export const getUserRewards = async(
  curVault: StaticVaultData
): Promise<string[]> => {
  // const { address: account } = useAccount();
const account = `0x9A45122d496983bdfDE3aE464C92b4610ad690fE`

  const contract = getContract({
    address: curVault.vaultAddress.rewardsVault,
    abi: rewardsVaultABI,
    client: publicClient,
  });

  const rewards = await Promise.all(
    curVault.rewardTokens.map(async (token) => {
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
};