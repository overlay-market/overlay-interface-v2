import {
  // Chain, 
  createPublicClient, 
  http 
} from 'viem'
// import { useMultichainContext } from '../state/multichain/useMultichainContext';
import { OverlaySDK } from 'overlay-sdk';
// import { CHAINS, DEFAULT_CHAINID,  VIEM_CHAINS } from '../constants/chains';
import { arbitrumSepolia } from 'viem/chains';

const useSDK = (): OverlaySDK => {
  const DEFAULT_CHAINID = 421614
  
  const rpcProvider = createPublicClient({
    chain: DEFAULT_CHAINID === 421614 ? arbitrumSepolia : undefined,
    transport: http(),
  });
  
  const web3Provider = window.ethereum;
  
  const sdk = new OverlaySDK({
    chainId: DEFAULT_CHAINID,
    rpcProvider,
    web3Provider
  });
  console.log('overlay-sdk initialized:', sdk)
  return sdk
}

export default useSDK;