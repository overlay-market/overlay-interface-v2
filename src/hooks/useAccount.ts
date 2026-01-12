import { useMemo } from 'react'
import { useAccount as useAccountWagmi } from 'wagmi'
import { useSupportedChainId } from './useSupportedChainId';
import { DEFAULT_CHAINID, CHAIN_ID_LOCAL_STORAGE_KEY } from '../constants/chains';
import { useAvatarTrading } from './useZodiacRoles';

const useAccount = () => {
  const { chainId, address: signerAddress, ...rest } = useAccountWagmi()
  const storedChainId = localStorage.getItem(CHAIN_ID_LOCAL_STORAGE_KEY);
  const { isAvatarTradingActive, activeAvatar } = useAvatarTrading();

  const supportedChainId = useSupportedChainId(chainId ?? (storedChainId ? parseInt(storedChainId, 10) : DEFAULT_CHAINID))

  const address = useMemo(() => {
    if (isAvatarTradingActive && activeAvatar) {
      return activeAvatar.avatar as `0x${string}`;
    }
    return signerAddress;
  }, [isAvatarTradingActive, activeAvatar, signerAddress]);

  return useMemo(
    () => ({
      ...rest,
      address,
      signerAddress,
      chainId: supportedChainId,
      isAvatarTradingActive,
    }),
    [rest, address, signerAddress, supportedChainId, isAvatarTradingActive],
  )
}

export default useAccount;