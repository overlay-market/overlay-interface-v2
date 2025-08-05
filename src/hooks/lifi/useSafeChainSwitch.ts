import { useConfig, useSwitchChain } from 'wagmi';
import { useCallback } from 'react';
import { useAddPopup } from '../../state/application/hooks';

interface UseSafeChainSwitchOptions {
  onSwitchStart?: (fromChainId: number, toChainId: number) => void;
}

export const useSafeChainSwitch = (options?: UseSafeChainSwitchOptions) => {
  const { switchChainAsync } = useSwitchChain();
  const config = useConfig(); 
   const addPopup = useAddPopup();

  const safeSwitch = useCallback(
    async (targetChainId: number): Promise<boolean> => {
      const currentChainId = config.state.chainId;

      if (currentChainId === targetChainId) {
        return true;
      }

      options?.onSwitchStart?.(currentChainId, targetChainId);
      
      try {
        await switchChainAsync({ chainId: targetChainId });
        await new Promise((res) => setTimeout(res, 1500));

        const updatedChainId = config.state.chainId;
        
        if (updatedChainId !== targetChainId) {
          throw new Error(`Switched chain does not match target chain (${targetChainId})`);
        }
        return true;
      } catch (err) {
        console.error('❌ Failed to switch chains:', err);
        addPopup({
          txn: {
            hash: Date.now().toString(),
            success: false,
            message: `Failed to switch to chain ${targetChainId}. Please switch manually.`,
            type: "CHAIN_SWITCH_ERROR",
          },
        }, Date.now().toString());
        return false;
      }
    },
    [options]
  );

  return { safeSwitch };
};