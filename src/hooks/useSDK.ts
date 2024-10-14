import { Chain, createPublicClient, http } from 'viem'
import { OverlaySDK } from 'overlay-sdk';
import { DEFAULT_CHAINID,  VIEM_CHAINS } from '../constants/chains';
import useMultichainContext from '../providers/MultichainContextProvider/useMultichainContext';
import { useConnectorClient } from 'wagmi';

const useSDK = (): OverlaySDK => {
  const { chainId } = useMultichainContext();
  const { data: walletClient } = useConnectorClient()

  const rpcProvider = createPublicClient({
    chain: VIEM_CHAINS[chainId as keyof typeof VIEM_CHAINS ?? DEFAULT_CHAINID as keyof typeof VIEM_CHAINS] as Chain,
    transport: http(),
  });
  
  const sdk = new OverlaySDK({
    chainId: chainId ? chainId as number: DEFAULT_CHAINID as number,
    rpcProvider,
    web3Provider: walletClient as any,
  });
  console.log('overlay-sdk initialized:', sdk)
  return sdk
}

export default useSDK;