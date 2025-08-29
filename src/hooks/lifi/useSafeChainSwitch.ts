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
        const result = await switchChainAsync({ chainId: targetChainId });
        
        // Verify the switch was successful by checking the returned chain
        if (result.id !== targetChainId) {
          throw new Error(`Chain switch failed: expected ${targetChainId}, got ${result.id}`);
        }
        
        // Also verify against wagmi config state
        const updatedChainId = config.state.chainId;
        if (updatedChainId !== targetChainId) {
          throw new Error(`Config state mismatch: expected ${targetChainId}, got ${updatedChainId}`);
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