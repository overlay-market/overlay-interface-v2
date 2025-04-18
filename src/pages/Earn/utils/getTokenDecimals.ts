import { Address, createPublicClient, getContract, http } from "viem";
import { berachain } from "viem/chains";
import {stakingTokenABI} from '../abi/stakingTokenABI'

const publicClient = createPublicClient({
  chain: berachain,
  transport: http(),
});

export const getTokenDecimals = async(
  tokenAddress: Address
): Promise<number> => {

  const contract = getContract({
    address: tokenAddress,
    abi: stakingTokenABI,
    client: publicClient,
  });

  const decimals = await contract.read.decimals() as number

  return decimals;
};