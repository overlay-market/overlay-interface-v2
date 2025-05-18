import { OverlaySDK } from 'overlay-sdk';
import { DEFAULT_CHAINID,  SUPPORTED_CHAINID } from '../constants/chains';
import useMultichainContext from '../providers/MultichainContextProvider/useMultichainContext';
import { useConnectorClient } from 'wagmi';

const useSDK = (): OverlaySDK => {
  const { chainId } = useMultichainContext();
  const { data: walletClient } = useConnectorClient()
  
  const sdk = new OverlaySDK({
    chainId: chainId ? chainId as number: DEFAULT_CHAINID as number,
    web3Provider: walletClient as any,
    rpcUrls: {
      [SUPPORTED_CHAINID.BARTIO]: import.meta.env.VITE_BARTIO_RPC,
      [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: import.meta.env
        .VITE_ARBITRUM_SEPOLIA_RPC,
      [SUPPORTED_CHAINID.BSC_TESTNET]: import.meta.env.VITE_BSC_TESTNET_RPC,
    }
  });

  return sdk
}

export default useSDK;