import { useCallback, useState } from "react";
import { useSolanaWallet } from "./useSolanaWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { 
  SOLANA_OVL_MINT
} from "../constants/bridge";

/**
 * Interface defining the parameters required for bridging OVL tokens
 * @param amount - The amount of OVL tokens to bridge (in human-readable format, e.g., 100.5)
 * @param destinationAddress - The destination address on BSC in 0x format (42 characters)
 */
export interface BridgeParams {
  amount: number;
  destinationAddress: string;
}

/**
 * Alternative Solana bridge hook for OVL token transfers from Solana to BSC
 * 
 * This hook serves as a fallback/placeholder implementation while the main LayerZero V2
 * integration is being developed. It demonstrates the basic flow of:
 * 1. Wallet connection and validation
 * 2. OVL balance checking
 * 3. Transaction creation and signing
 * 4. Transaction submission and confirmation
 * 
 * IMPORTANT: This is NOT a real bridge implementation. It creates a placeholder transaction
 * that transfers a tiny amount of SOL to demonstrate wallet approval flow.
 * 
 * The real bridge will use LayerZero V2 SDK to transfer OVL tokens cross-chain.
 * 
 * @returns Object containing:
 * - bridgeToBSC: Function to execute the placeholder bridge transaction
 * - isLoading: Loading state during bridge operation
 * - error: Any error that occurred during bridging
 * - clearError: Function to clear error state
 */
export function useSolanaBridge() {
  // Get Solana wallet connection and signing capabilities
  const { publicKey, signTransaction } = useSolanaWallet();
  
  // Get Solana network connection for RPC calls
  const { connection } = useConnection();
  
  // State management for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Placeholder bridge function that demonstrates the basic bridge flow
   * 
   * This function performs the following steps:
   * 1. Input validation (wallet connection, address format, amount)
   * 2. Balance verification (ensures user has sufficient OVL tokens)
   * 3. Placeholder transaction creation (transfers tiny amount of SOL to self)
   * 4. Transaction signing and submission
   * 5. Confirmation waiting and error handling
   * 
   * NOTE: This is a demonstration function that does NOT actually bridge OVL tokens.
   * It creates a simple SOL transfer to show the wallet approval flow.
   * 
   * @param params - BridgeParams object containing amount and destination address
   * @returns Promise resolving to transaction result with signature and success status
   * @throws Error if any step fails (wallet not connected, insufficient balance, etc.)
   */
  const bridgeToBSC = useCallback(async ({ amount, destinationAddress }: BridgeParams) => {
    // STEP 1: Pre-flight validation - ensure all required components are available
    if (!publicKey || !signTransaction || !connection) {
      throw new Error("Wallet not connected");
    }

    // Set loading state and clear any previous errors
    setIsLoading(true);
    setError(null);

    try {
      // STEP 2: Validate destination address format
      // BSC addresses must start with 0x and be exactly 42 characters (20 bytes + 0x prefix)
      if (!destinationAddress.startsWith("0x") || destinationAddress.length !== 42) {
        throw new Error("Invalid BSC destination address");
      }

      // STEP 3: Check if user has enough OVL tokens to bridge
      // This validates that the user has the OVL tokens they want to bridge
      // Note: We're not actually transferring these tokens in this placeholder implementation
      const mintPk = new PublicKey(SOLANA_OVL_MINT);
      
      // Query all token accounts owned by the user that contain OVL tokens
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: mintPk }
      );

      // If no OVL token account exists, user cannot bridge
      if (tokenAccounts.value.length === 0) {
        throw new Error("No OVL token account found");
      }

      // Extract the actual token balance from the account data
      // Solana stores token amounts with decimals, so we get the UI amount (human-readable)
      const tokenAccount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      
      // Ensure user has sufficient balance for the bridge operation
      if (tokenAccount < amount) {
        throw new Error("Insufficient OVL balance");
      }

      // STEP 4: Create a placeholder transaction for demonstration purposes
      // This is NOT a real bridge transaction - it's just to show wallet approval flow
      // In production, this would be replaced with the actual LayerZero bridge instruction
      const transaction = new Transaction();
      
      // STEP 5: Get the latest blockhash for transaction validity
      // Solana requires a recent blockhash to prevent transaction replay attacks
      // The blockhash must be recent (within ~150 blocks) for the transaction to be accepted
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // STEP 6: Add a placeholder transfer instruction
      // This demonstrates the wallet approval flow but does NOT bridge OVL tokens
      // The instruction transfers a tiny amount of SOL (0.0001 SOL) from the user to themselves
      // This is purely for demonstration - the real bridge will transfer OVL tokens cross-chain
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,    // Source: user's wallet
          toPubkey: publicKey,      // Destination: same wallet (placeholder)
          lamports: LAMPORTS_PER_SOL * 0.0001, // Amount: 0.0001 SOL (very small for demo)
        })
      );

      // STEP 7: Sign the transaction with the user's wallet
      // This requires user approval in the wallet (Phantom, Solflare, etc.)
      // The wallet will display the transaction details for user confirmation
      // This step demonstrates the real bridge flow where users approve LayerZero transactions
      const signedTransaction = await signTransaction(transaction);
      
      // STEP 8: Submit the signed transaction to the Solana network
      // We use sendRawTransaction because the transaction is already signed
      // This is more efficient than sendTransaction which expects unsigned transactions
      const txSignature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log(`Transaction sent: ${txSignature}`);
      
      // STEP 9: Wait for transaction confirmation with enhanced error handling
      // We implement a robust confirmation strategy that handles various edge cases
      try {
        // Wait for 'confirmed' status which means the transaction has been processed
        // by a supermajority of the network (more reliable than 'processed')
        const confirmation = await connection.confirmTransaction(txSignature, 'confirmed');
        
        // Check if the transaction actually succeeded
        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }
        
        console.log(`Transaction confirmed: ${txSignature}`);
      } catch (confirmError) {
        // STEP 10: Fallback confirmation check
        // Sometimes the confirmation API fails, but the transaction might still succeed
        // We check the transaction status directly to verify success
        const status = await connection.getSignatureStatus(txSignature);
        
        if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
          console.log(`Transaction succeeded despite confirmation error: ${txSignature}`);
        } else {
          // If the transaction truly failed, re-throw the confirmation error
          throw confirmError;
        }
      }

      // STEP 11: Log success and return result
      // This demonstrates that the basic transaction flow works
      console.log(`Bridge transaction completed: ${txSignature}`);
      console.log(`Bridging ${amount} OVL from Solana to BSC address: ${destinationAddress}`);

      // Return success result with transaction signature
      // The signature can be used to track the transaction on Solana explorers
      return { signature: txSignature, success: true };
      
    } catch (err) {
      // STEP 12: Error handling and cleanup
      // Extract error message and update error state
      const errorMessage = err instanceof Error ? err.message : "Bridge failed";
      setError(errorMessage);
      
      // Re-throw the error so the calling component can handle it
      throw err;
    } finally {
      // Always reset loading state, regardless of success or failure
      setIsLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  // Return the hook's public interface
  return {
    bridgeToBSC,        // Main bridge function (placeholder implementation)
    isLoading,          // Loading state indicator
    error,              // Current error message (if any)
    clearError: () => setError(null), // Function to clear error state
  };
}
