import { Chain, createPublicClient, http } from 'viem'
import { OverlaySDK } from 'overlay-sdk';
import { DEFAULT_CHAINID,  VIEM_CHAINS } from '../constants/chains';
import useMultichainContext from '../providers/MultichainContextProvider/useMultichainContext';

const useSDK = (): OverlaySDK => {
  const { chainId } = useMultichainContext();

  const rpcProvider = createPublicClient({
    chain: VIEM_CHAINS[chainId as keyof typeof VIEM_CHAINS ?? DEFAULT_CHAINID as keyof typeof VIEM_CHAINS] as Chain,
    transport: http(),
  });
  
  const web3Provider = window.ethereum;
  
  const sdk = new OverlaySDK({
    chainId: chainId ? chainId as number: DEFAULT_CHAINID as number,
    rpcProvider,
    web3Provider
  });
  console.log('overlay-sdk initialized:', sdk)
  return sdk
}

export default useSDK;