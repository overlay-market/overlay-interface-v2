import { useCallback } from 'react';
import type {  Address } from 'viem';
import { checkAndApproveToken } from '../../utils/lifi/checkAndApproveToken';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { Token } from '../../types/selectChainAndTokenTypes';
import { TradeStage } from './useLiFiTrade';
import { TransactionType } from '../../constants/transaction';
import { useAddPopup } from '../../state/application/hooks';

export const useTokenApprovalWithLiFi = ({setTradeStage}: {setTradeStage: (stage: TradeStage) => void;}) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address: ownerAddress } = useAccount();
  const addPopup = useAddPopup();  
   
  const approveIfNeeded = useCallback(
    async ({
      token,
      spenderAddress,
      tokenAmountSelected,
    }: {
      token: Token;
      spenderAddress: Address;
      tokenAmountSelected: bigint;
    }): Promise<void> => {
      if (!walletClient || !publicClient || !ownerAddress) {
        setTradeStage({ stage: 'error', message: 'Wallet not connected' });
        throw new Error('Wallet or client not connected');
      }

      try {
        setTradeStage({ stage: 'approval', message: 'Checking token allowance...' });

        const txHash = await checkAndApproveToken({
          walletClient,
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
      } catch (error: any) {
        console.error(error);
        setTradeStage({
          stage: 'error',
          message: 'Token approval failed',
        });

        addPopup({
          txn: {
            hash: Date.now().toString(),
            success: false,
            message: `Token approval failed`,
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