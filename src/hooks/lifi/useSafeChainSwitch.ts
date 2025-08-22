import { useConfig, useSwitchChain } from 'wagmi';
import { useCallback } from 'react';
import { useAddPopup } from '../../state/application/hooks';
import { ExtendedChain } from '@lifi/sdk';

interface UseSafeChainSwitchOptions {
  onSwitchStart?: (fromChainId: number, toChainId: number) => void;
}

type ChainInput = number | ExtendedChain;

export const useSafeChainSwitch = (options?: UseSafeChainSwitchOptions) => {
  const { switchChainAsync } = useSwitchChain();
  const config = useConfig();
  const addPopup = useAddPopup();

  const waitForChain = async (targetChainId: number, timeout = 5000) => {
    const start = Date.now();
    const provider = (window as any).ethereum;
    if (!provider) return false;

    while (Date.now() - start < timeout) {
      try {
        const chainIdHex = await provider.request({ method: 'eth_chainId' });
        if (parseInt(chainIdHex, 16) === targetChainId) return true;
      } catch {
        // ignore errors while polling
      }
      await new Promise((res) => setTimeout(res, 200));
    }
    return false;
  };

  const safeSwitch = useCallback(
    async (target: ChainInput): Promise<boolean> => {
      const currentChainId = config.state.chainId;
      let targetChainId: number;
      let chainToAdd: ExtendedChain | undefined;

      if (typeof target === 'number') {
        targetChainId = target;
      } else {
        targetChainId = target.id;
        chainToAdd = target;
      }

      if (currentChainId === targetChainId) return true;
      options?.onSwitchStart?.(currentChainId, targetChainId);

      try {
        const provider = (window as any).ethereum;
        // If we have an ExtendedChain, try to add it first
        if (chainToAdd && provider) {
          
            try {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${targetChainId.toString(16)}`,
                    chainName: chainToAdd.name,
                    nativeCurrency: {
                      name: chainToAdd.metamask.nativeCurrency.name,
                      symbol: chainToAdd.metamask.nativeCurrency.symbol,
                      decimals: chainToAdd.metamask.nativeCurrency.decimals,
                    },
                    rpcUrls: chainToAdd.metamask.rpcUrls,
                    blockExplorerUrls: chainToAdd.metamask.blockExplorerUrls,
                  },
                ],
              });
            } catch (addErr) {
              console.warn('User rejected adding the chain or chain already exists', addErr);
              throw new Error('User rejected adding the chain');
            }          
        }

        // Switch chain
        await switchChainAsync({ chainId: targetChainId });
        const switched = await waitForChain(targetChainId);
        if (!switched) throw new Error(`Switched chain does not match target chain`);
        // await new Promise((res) => setTimeout(res, 1500));

        const updatedChainId = config.state.chainId;
        if (updatedChainId !== targetChainId) {
          throw new Error(`Switched chain does not match target chain (${targetChainId})`);
        }

        return true;
      } catch (err: any) {
        console.error('❌ Failed to switch chains:', err);
        addPopup(
          {
            txn: {
              hash: Date.now().toString(),
              success: false,
              message: `Failed to switch to chain ${targetChainId}. Please switch manually.`,
              type: 'CHAIN_SWITCH_ERROR',
            },
          },
          Date.now().toString()
        );
        return false;
      }
    },
    [options, config, switchChainAsync, addPopup]
  );

  return { safeSwitch };
};