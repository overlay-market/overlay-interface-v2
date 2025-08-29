import { useCallback } from 'react';
import type { Address, WalletClient } from 'viem';
import { checkAndApproveToken } from '../../utils/lifi/checkAndApproveToken';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { Token } from '../../types/selectChainAndTokenTypes';
import { TransactionType } from '../../constants/transaction';
import { useAddPopup } from '../../state/application/hooks';
import { BridgeStage } from './useLiFiBridge';

export const useTokenApprovalWithLiFi = ({setTradeStage}: {setTradeStage: (stage: BridgeStage) => void;}) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address: ownerAddress } = useAccount();
  const addPopup = useAddPopup();  
   
  const approveIfNeeded = useCallback(
    async ({
      token,
      spenderAddress,
      tokenAmountSelected,
      freshWalletClient,
    }: {
      token: Token;
      spenderAddress: Address;
      tokenAmountSelected: bigint;
      freshWalletClient?: WalletClient;
    }): Promise<void> => {
      // Use fresh wallet client if provided, otherwise fallback to hook client
      const clientToUse = freshWalletClient || walletClient;
      
      if (!clientToUse || !publicClient || !ownerAddress) {
        setTradeStage({ stage: 'idle', message: 'Wallet not connected' });
        throw new Error('Wallet or client not connected');
      }

      console.log("🔍 approveIfNeeded using wallet client:", {
        usingFreshClient: !!freshWalletClient,
        clientChainId: clientToUse.chain?.id,
        expectedChainId: token.chainId,
        chainMatches: clientToUse.chain?.id === token.chainId
      });

      try {
        setTradeStage({ stage: 'approval', message: 'Checking token allowance...' });

        const txHash = await checkAndApproveToken({
          walletClient: clientToUse,
          token,
          ownerAddress,
          spenderAddress,
          tokenAmountSelected,
        });

        if (txHash) {
          setTradeStage({ stage: 'approval', message: 'Waiting for transaction confirmation...' });

          await publicClient.waitForTransactionReceipt({ hash: txHash });

          setTradeStage({ stage: 'approval', message: 'Token approved successfully' });

          addPopup({
            txn: {
              hash: txHash,
              success: true,
              message: "",
              type: TransactionType.APPROVAL, 
            },
          }, txHash);
        } 
      } catch (error: unknown) {
        console.error(error);
        setTradeStage({
          stage: 'idle',
          message: 'Token approval failed',
        });

        const errorMessage = error instanceof Error ? error.message : 'Token approval failed';
        addPopup({
          txn: {
            hash: Date.now().toString(),
            success: false,
            message: errorMessage,
            type: "CHAIN_SWITCH_ERROR",
          },
        }, Date.now().toString());
        throw error;
      }
    },
    [walletClient, publicClient, ownerAddress, setTradeStage, addPopup],
  );

  return {
    approveIfNeeded,  
  };
};