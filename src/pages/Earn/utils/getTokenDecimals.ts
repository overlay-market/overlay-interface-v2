import { Address,  erc20Abi,  getContract, PublicClient } from "viem";

export const getTokenDecimals = async(
  tokenAddress: Address,
  publicClient: PublicClient,
): Promise<number> => {

  const contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client: publicClient,
  });

  const decimals = await contract.read.decimals() as number

  return decimals;
};