import { Address, createPublicClient, GetEnsNameReturnType, http, PublicClient, GetEnsAvatarReturnType } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from 'viem/ens'
import useSDK from "../providers/SDKProvider/useSDK";
import { SUPPORTED_CHAINID } from "../constants/chains";
import { ExtendedUserData } from "../pages/Leaderboard/types";

type GetEnsNameFunction = (address: Address) => Promise<GetEnsNameReturnType>;
type GetEnsAvatarFunction = (name: string) => Promise<GetEnsAvatarReturnType>;
type ResolveEnsProfilesFunction = (users: ExtendedUserData[]) => Promise<ExtendedUserData[]>;

const publicClient: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const useGetClient = (): PublicClient => {
  const sdk = useSDK();
  return sdk.core.chainId as number === SUPPORTED_CHAINID.MAINNET ? sdk.core.rpcProvider : publicClient;
};


export const useGetEnsName = (): GetEnsNameFunction => {
  const client = useGetClient();

  const getEnsName: GetEnsNameFunction = async (address) => {
    const name = await client.getEnsName({ address });
    return name;
  };

  return getEnsName;
};

export const useGetEnsAvatar = (): GetEnsAvatarFunction => {
  const client = useGetClient();

  const getEnsAvatar: GetEnsAvatarFunction = async(name) => {
    const avatarUrl = await client.getEnsAvatar({
      name: normalize(name),
    });  
    return avatarUrl
  }
  return getEnsAvatar;
}

export const useResolveEnsProfiles = (): ResolveEnsProfilesFunction => {
  const client = useGetClient();
  
  const resolveEnsProfiles: ResolveEnsProfilesFunction = async (users) => {
    const promises = users.map(async(user) => {
      const username = await client.getEnsName({address: user._id as Address})
      const avatarUrl = username && (await client.getEnsAvatar({
        name: normalize(username),
      }))
  
      if (username) {
        user.username = username;
        if (avatarUrl) {
          user.avatar = avatarUrl;
        }      
      }
      return user
    }    
    );
    return Promise.all(promises);
  }
  return resolveEnsProfiles
};
