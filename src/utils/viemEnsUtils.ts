import { Address, createPublicClient, GetEnsNameReturnType, http } from "viem";
import { mainnet, berachain } from "viem/chains";
import { normalize } from 'viem/ens'

type GetEnsNameFunction = (address: Address) => Promise<GetEnsNameReturnType>;

type ExtendedUserData = {
  _id: string; 
  username?: string; 
  avatar?: string; 
  [key: string]: any; 
};
type ResolveEnsProfilesFunction = (users: ExtendedUserData[]) => Promise<ExtendedUserData[]>;

const berachainWithEns = {
  ...berachain,
  contracts: {
    ensRegistry: {
      address: "0x5b22280886a2f5e09a49bea7e320eab0e5320e28" as `0x${string}`,
    },
    ensUniversalResolver: {
      address: "0xddfb18888a9466688235887dec2a10c4f5effee9" as `0x${string}`,
    },
  },
};

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const berachainClient = createPublicClient({
  chain: berachainWithEns,
  transport: http(),
})

type ClientType = typeof mainnetClient | typeof berachainClient;

export const useGetEnsName = (): GetEnsNameFunction => {
  const getEnsName: GetEnsNameFunction = async (address) => {
    
    let name: GetEnsNameReturnType;
    name = await berachainClient.getEnsName({ address });
    if (!name) {
      name = await mainnetClient.getEnsName({ address });
    }
   
    return name;
  };

  return getEnsName;
};

export const useResolveEnsProfiles = (): ResolveEnsProfilesFunction => {
  const resolveEnsProfiles: ResolveEnsProfilesFunction = async (users) => {
    const promises = users.map(async (user) => {
      let clientUsed: ClientType;

      let username = await berachainClient.getEnsName({ address: user._id as Address });
      clientUsed = berachainClient;

      if (!username) {
        username = await mainnetClient.getEnsName({ address: user._id as Address });
        clientUsed = mainnetClient; 
      }

      if (!username) return user;

      user.username = username;

      const avatarUrl = await clientUsed.getEnsAvatar({ name: normalize(username) });

      if (avatarUrl) {
        user.avatar = avatarUrl;
      }

      return user;
    });

    return Promise.all(promises);
  };

  return resolveEnsProfiles;
};


