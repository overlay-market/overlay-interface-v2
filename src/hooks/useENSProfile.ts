import {  useQuery, useQueryClient } from "@tanstack/react-query";
import { Address, createPublicClient, http,  PublicClient } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { ExtendedUserData } from "../pages/Leaderboard/types";
import { useEffect, useState } from "react";

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

export type ENSResult = Record<string, { username?: string; avatar?: string }>;

export const useResolveENSProfilesBatched = (users: ExtendedUserData[] | undefined) => {
  const queryClient = useQueryClient();
  const [ensProfiles, setEnsProfiles] = useState<ENSResult>({});

  useEffect(() => {
    if (!users || users.length === 0) return;

    const unresolvedUsers = users.filter(
      (u) =>
        u.walletAddress &&
        !queryClient.getQueryData(['ensProfile', u.walletAddress])
    );

    if (!unresolvedUsers.length) return;

    const fetchBatch = async () => {
      const newProfiles: ENSResult = {};

      await Promise.all(
        unresolvedUsers.map(async (user) => {
          const username = await mainnetClient.getEnsName({
            address: user.walletAddress as Address,
          });
          let avatar: string | null = null;
          if (username) {
            avatar = await mainnetClient.getEnsAvatar({ name: normalize(username) });
          }

          const profile = { username: username || undefined, avatar: avatar || undefined };

          queryClient.setQueryData(['ensProfile', user.walletAddress], profile);

          newProfiles[user.walletAddress] = profile;
        })
      );

      setEnsProfiles((prev) => ({ ...prev, ...newProfiles }));
    };

    fetchBatch();
  }, [users, queryClient]);

  // Combine React Query cached profiles and local state
  const combinedProfiles: ENSResult = {};
  users?.forEach((user) => {
    if (!user.walletAddress) return;
    const cached = queryClient.getQueryData<ENSResult[number]>(['ensProfile', user.walletAddress]);
    combinedProfiles[user.walletAddress] = cached || ensProfiles[user.walletAddress];
  });

  return combinedProfiles;
};