import { useQuery } from "@tanstack/react-query";
import { erc20Abi, isAddress } from "viem";
import { readContract } from "wagmi/actions";
import { wagmiConfig } from "../providers/Web3Provider/wagmi";
import { CommunityPool } from "../types/communityPools";

export const isCommunityPoolChainSupported = (chainId: number) => {
  return wagmiConfig.chains.some((chain) => chain.id === chainId);
};

export const useCommunityPoolBalance = (pool: CommunityPool) => {
  const isSupportedChain = isCommunityPoolChainSupported(pool.chain.chainId);
  const hasValidAddresses =
    isAddress(pool.safeAddress) && isAddress(pool.contributionToken.address);

  return useQuery({
    queryKey: [
      "communityPoolBalance",
      pool.slug,
      pool.chain.chainId,
      pool.safeAddress,
      pool.contributionToken.address,
    ],
    queryFn: async () => {
      return await readContract(wagmiConfig, {
        chainId: pool.chain.chainId,
        address: pool.contributionToken.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [pool.safeAddress],
      });
    },
    enabled: isSupportedChain && hasValidAddresses,
    refetchInterval: 30_000,
    staleTime: 30_000,
  });
};
