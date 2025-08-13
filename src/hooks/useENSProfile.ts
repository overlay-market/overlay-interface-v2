import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Address, createPublicClient, http, PublicClient } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { ExtendedUserData } from "../pages/Leaderboard/types";

const mainnetClient: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});


export const useENSName = (address: Address | undefined) => {
  return useQuery({
    queryKey: ['ensName', address],
    queryFn: async () => {
      if (!address) return null;
      try {
        const name = await mainnetClient.getEnsName({ address });
        return name;
      } catch (err) {
        console.error(`Failed to resolve ENS name for ${address}:`, err);
        return null;
      }
    },
    enabled: !!address, 
    staleTime: Infinity, 
  });
};

export const useENSAvatar = (name: string | undefined | null) => {
  return useQuery({
    queryKey: ['ensAvatar', name],
    queryFn: async () => {
      if (!name) return null;
      return await mainnetClient.getEnsAvatar({ name: normalize(name) });
    },
    enabled: !!name, 
    staleTime: Infinity, 
  });
};

export const useResolveENSProfiles = (users: ExtendedUserData[] | undefined): UseQueryResult<ExtendedUserData, unknown>[] => {
  return useQueries({
    queries: (users || []).map(user => ({
      queryKey: ['ensProfile', user.walletAddress],
      queryFn: async () => {
        const name = await mainnetClient.getEnsName({ address: user.walletAddress as Address });
        let avatar = null;
        if (name) {
          avatar = await mainnetClient.getEnsAvatar({ name: normalize(name) });
        }
        return {
          ...user,
          username: name,
          avatar: avatar,
        };
      },
      staleTime: Infinity,
      enabled: !!user.walletAddress,
    })),
  });
};