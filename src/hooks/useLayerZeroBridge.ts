import { useCallback, useState } from "react";
import { useSolanaWallet } from "./useSolanaWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  SOLANA_OVL_MINT,
  SOLANA_OFT_PROGRAM_ID,
  SOLANA_ESCROW
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
 * Custom hook for bridging OVL tokens from Solana to Binance Smart Chain (BSC) using LayerZero V2
 * 
 * This hook provides the core functionality for cross-chain token transfers:
 * 1. Validates user input and wallet connection
 * 2. Checks OVL token balance on Solana
 * 3. Creates and sends LayerZero bridge transactions
 * 4. Handles transaction confirmation and error states
 * 
 * Note: Currently using a placeholder implementation that simulates LayerZero structure.
 * The real LayerZero V2 SDK integration will replace this once type conflicts are resolved.
 * 
 * @returns Object containing:
 * - bridgeToBSC: Function to execute the bridge transaction
 * - isLoading: Loading state during bridge operation
 * - error: Any error that occurred during bridging
 * - clearError: Function to clear error state
 */
export function useLayerZeroBridge() {
  // Get Solana wallet connection and signing capabilities
  const { publicKey, signTransaction } = useSolanaWallet();
  
  // Get Solana network connection for RPC calls
  const { connection } = useConnection();
  
  // State management for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Main bridge function that transfers OVL tokens from Solana to BSC
   * 
   * This function performs the following steps:
   * 1. Input validation (wallet connection, address format, amount)
   * 2. Balance verification (ensures user has sufficient OVL tokens)
   * 3. Transaction creation with LayerZero-compatible structure
   * 4. Transaction signing and submission
   * 5. Confirmation waiting and error handling
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
      // We need to find the user's OVL token account and verify their balance
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
      const tokenBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      
      // Ensure user has sufficient balance for the bridge operation
      if (tokenBalance < amount) {
        throw new Error("Insufficient OVL balance");
      }

      console.log(`Starting LayerZero bridge for ${amount} OVL to ${destinationAddress}`);

      // STEP 4: Create the bridge transaction
      // Currently using a placeholder implementation that simulates LayerZero structure
      // This will be replaced with the real LayerZero V2 SDK once type conflicts are resolved
      const transaction = new Transaction();
      
      // STEP 5: Get the latest blockhash for transaction validity
      // Solana requires a recent blockhash to prevent transaction replay attacks
      // The blockhash must be recent (within ~150 blocks) for the transaction to be accepted
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // STEP 6: Create a realistic LayerZero instruction structure
      // This simulates what the real SDK would create, but is not a valid LayerZero instruction
      // The structure includes:
      // - Instruction type (0x01 for OFT operations)
      // - Destination address (BSC address without 0x prefix)
      // - Amount and minimum amount (8 bytes each for u64)
      // - Destination endpoint ID (4 bytes for u32)
      const instructionData = Buffer.concat([
        Buffer.from([0x01]), // Instruction type for LayerZero OFT
        Buffer.from(destinationAddress.slice(2), 'hex'), // Destination address (remove 0x prefix)
        Buffer.alloc(8), // Amount (8 bytes for u64)
        Buffer.alloc(8), // Min amount (8 bytes for u64)
        Buffer.alloc(4), // DstEid (4 bytes for u32)
      ]);

      // STEP 7: Add the LayerZero OFT instruction to the transaction
      // This creates the instruction with proper account keys and program ID
      // The keys define which accounts the instruction will interact with:
      // - publicKey: The user's wallet (signer and writable)
      // - mintPk: The OVL token mint (writable for balance updates)
      // - SOLANA_ESCROW: The escrow account that holds tokens during bridging (writable)
      // - SOLANA_OFT_PROGRAM_ID: The LayerZero OFT program (read-only)
      transaction.add({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: mintPk, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(SOLANA_ESCROW), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(SOLANA_OFT_PROGRAM_ID), isSigner: false, isWritable: false },
        ],
        programId: new PublicKey(SOLANA_OFT_PROGRAM_ID),
        data: instructionData,
      });

      console.log(`LayerZero bridge transaction created with realistic structure`);

      // STEP 8: Sign the transaction with the user's wallet
      // This requires user approval in the wallet (Phantom, Solflare, etc.)
      // The wallet will display the transaction details for user confirmation
      const signedTransaction = await signTransaction(transaction);
      
      console.log(`LayerZero bridge transaction created and signed`);
      
      // STEP 9: Submit the signed transaction to the Solana network
      // We use sendRawTransaction because the transaction is already signed
      // This is more efficient than sendTransaction which expects unsigned transactions
      const txSignature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log(`LayerZero bridge transaction sent: ${txSignature}`);
      
      // STEP 10: Wait for transaction confirmation
      // We wait for 'confirmed' status which means the transaction has been processed
      // by a supermajority of the network (more reliable than 'processed')
      await connection.confirmTransaction(txSignature, 'confirmed');
      
      console.log(`LayerZero bridge transaction confirmed: ${txSignature}`);
      
      // Return success result with transaction signature
      // The signature can be used to track the transaction on Solana explorers
      return { signature: txSignature, success: true };
      
    } catch (err) {
      // STEP 11: Error handling and cleanup
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
    bridgeToBSC,        // Main bridge function
    isLoading,          // Loading state indicator
    error,              // Current error message (if any)
    clearError: () => setError(null), // Function to clear error state
  };
}
