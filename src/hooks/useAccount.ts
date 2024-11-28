import { useMemo } from 'react'
import { useAccount as useAccountWagmi } from 'wagmi'
import { useSupportedChainId } from './useSupportedChainId';
import { CHAIN_ID_LOCAL_STORAGE_KEY } from '../components/Wallet/ChainSwitch';

const useAccount = () => {
  const { chainId, ...rest } = useAccountWagmi()
  const storedChainId = localStorage.getItem(CHAIN_ID_LOCAL_STORAGE_KEY);

  const supportedChainId = useSupportedChainId(chainId ?? (storedChainId ? parseInt(storedChainId, 10) : undefined))

  return useMemo(
    () => ({
      ...rest,
      chainId: supportedChainId,
    }),
    [ rest, supportedChainId],
  )
}

export default useAccount;