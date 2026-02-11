import { useMemo } from 'react';
import { useAccount as useAccountWagmi } from 'wagmi';
import { useSupportedChainId } from './useSupportedChainId';
import { CHAIN_ID_LOCAL_STORAGE_KEY } from '../components/Wallet/ChainSwitch';
import { DEFAULT_CHAINID } from '../constants/chains';
import useMiniAppSdk from '../providers/MiniAppSdkProvider/useMiniAppSdk';

const useAccount = () => {
  const { chainId, ...rest } = useAccountWagmi();
  const { walletAddress } = useMiniAppSdk();
  const storedChainId = localStorage.getItem(CHAIN_ID_LOCAL_STORAGE_KEY);

  const fallbackChainId = storedChainId
    ? parseInt(storedChainId, 10)
    : DEFAULT_CHAINID;
  const supportedChainId = useSupportedChainId(chainId ?? fallbackChainId);
  const derivedAddress = walletAddress ?? rest.address;
  const derivedIsConnected = rest.isConnected || Boolean(walletAddress);
  const derivedStatus = derivedIsConnected ? "connected" : rest.status;

  return useMemo(
    () => ({
      ...rest,
      chainId: supportedChainId,
      address: derivedAddress,
      addresses: derivedAddress
        ? rest.addresses && rest.addresses.length > 0
          ? rest.addresses
          : ([derivedAddress] as `0x${string}`[])
        : rest.addresses,
      isConnected: derivedIsConnected,
      isDisconnected: derivedIsConnected ? false : rest.isDisconnected,
      isConnecting: derivedIsConnected ? false : rest.isConnecting,
      isReconnecting: derivedIsConnected ? false : rest.isReconnecting,
      status: derivedStatus,
    }),
    [rest, supportedChainId, derivedAddress, derivedIsConnected, derivedStatus],
  );
};

export default useAccount;
