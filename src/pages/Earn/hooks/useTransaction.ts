import { useState } from "react";
import { useAddPopup } from "../../../state/application/hooks";
import { TransactionType } from "../../../constants/transaction";
import {  Account, Address, TransactionReceipt, WriteContractParameters } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

interface UseTransactionOptions {
  successMessage?: string;
  type: TransactionType; 
  skipGasEstimation?: boolean;
}

interface TransactionResult {
  sendTransaction: (config: WriteContractParameters) => Promise<Address | null>;
  txHash: Address | null;
  txReceipt: TransactionReceipt | null;
  loading: boolean;
  error: Error | null;
}

export const useTransaction = (options: UseTransactionOptions): TransactionResult => {
  const addPopup = useAddPopup();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<Address | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null);  
    
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

    setLoading(true);
    setError(null);

    try {
      const defaultGasLimit = BigInt(100_000);
      let gasWithBuffer = defaultGasLimit;

      if (!options.skipGasEstimation) {
        const estimatedGas = await publicClient.estimateContractGas({
          address: config.address,
          abi: config.abi,
          functionName: config.functionName,
          args: config.args,
          account: config.account as `0x${string}` | Account,
        });
        gasWithBuffer = BigInt(Math.floor(Number(estimatedGas) * 1.15));
      } 

      const simulationConfig = {
        ...config,
        gas: gasWithBuffer,
        account: walletClient.account,
        chain: config.chain ?? walletClient.chain, 
      };

      const { request } = await publicClient.simulateContract(simulationConfig);

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setTxHash(receipt.transactionHash);
      setTxReceipt(receipt);
      
      addPopup({
        txn: {
          hash: receipt.transactionHash,
          success: receipt.status === "success",
          message: options?.successMessage ?? "Transaction confirmed!",
          type: options.type,
        },
      }, receipt.transactionHash);

      setLoading(false);
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

      setLoading(false);
      setError(err as Error);
      return null;
    }
  };

  return {
    sendTransaction,
    txHash,
    txReceipt,
    loading,
    error,
  };
};