import { useState } from "react";
import { useAddPopup } from "../../../state/application/hooks";
import { TransactionType } from "../../../constants/transaction";
import {  WriteContractParameters } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

interface UseTransactionOptions {
  successMessage?: string;
  type: TransactionType; 
}

export const useTransaction = (options: UseTransactionOptions) => {
  const addPopup = useAddPopup();

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
    
  const sendTransaction = async (config: WriteContractParameters) => {
    if (!walletClient) {
      console.error("Wallet client not available");
      return null;
    }
    if (!publicClient) {
      console.error("Public client not available");
      return null;
    }
    if (!walletClient.account) {
      console.error('No account connected to wallet client');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const simulationConfig = {
        ...config,
        account: walletClient.account,
        chain: config.chain ?? walletClient.chain, 
      };

      const { request } = await publicClient.simulateContract(simulationConfig);

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setTxHash(receipt.transactionHash);
      
      addPopup({
        txn: {
          hash: receipt.transactionHash,
          success: receipt.status === "success",
          message: options?.successMessage ?? "Transaction confirmed!",
          type: options.type,
        },
      }, receipt.transactionHash);

      setIsLoading(false);
      return hash;
    } catch (err) {
      console.error("Transaction error:", err);

      const fallbackId = Date.now().toString();

      addPopup({
        txn: {
          hash: fallbackId,
          success: false,
          message: (err as Error)?.message ?? "Transaction failed",
          type: options.type,
        },
      }, fallbackId);

      setIsLoading(false);
      setError(err as Error);
      return null;
    }
  };

  return {
    sendTransaction,
    isLoading,
    txHash,
    error,
  };
};