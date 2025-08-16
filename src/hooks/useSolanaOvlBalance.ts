import { useState, useEffect } from "react";
import { useSolanaWallet } from "./useSolanaWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_OVL_MINT } from "../constants/bridge";

/**
 * Custom hook for fetching and managing OVL token balance on Solana blockchain
 * 
 * This hook provides real-time balance information for OVL tokens held by the connected
 * Solana wallet. It automatically updates when:
 * - The wallet connection changes (connect/disconnect)
 * - The wallet address changes (switching between wallets)
 * - The Solana network connection changes
 * 
 * The hook handles various edge cases:
 * - No wallet connected (returns 0 balance)
 * - No OVL token account found (returns 0 balance)
 * - Network errors (returns 0 balance and logs error)
 * - Loading states during balance fetching
 * 
 * @returns Object containing:
 * - balance: Current OVL token balance (number, 0 if no balance or error)
 * - isLoading: Loading state indicator during balance fetch operations
 */
export function useSolanaOvlBalance() {
  // Get Solana network connection for RPC calls
  // This provides access to Solana blockchain data (account info, balances, etc.)
  const { connection } = useConnection();
  
  // Get the currently connected Solana wallet's public key
  // This identifies which wallet's balance we need to fetch
  const { publicKey } = useSolanaWallet();
  
  // State management for balance and loading states
  const [balance, setBalance] = useState<number>(0);        // Current OVL balance
  const [isLoading, setIsLoading] = useState(false);        // Loading indicator

  /**
   * Effect hook that automatically fetches OVL balance when dependencies change
   * 
   * This useEffect runs whenever:
   * - publicKey changes (wallet connects/disconnects or switches)
   * - connection changes (network endpoint changes)
   * 
   * The effect ensures that the balance is always up-to-date with the current wallet state.
   */
  useEffect(() => {
    /**
     * Async function to fetch the OVL token balance from Solana blockchain
     * 
     * This function performs the following steps:
     * 1. Validates that both wallet and connection are available
     * 2. Queries the Solana blockchain for OVL token accounts owned by the wallet
     * 3. Extracts the balance from the account data
     * 4. Updates the local state with the fetched balance
     * 5. Handles errors gracefully by setting balance to 0
     */
    const fetchBalance = async () => {
      // STEP 1: Early return if prerequisites are not met
      // If no wallet is connected or no network connection exists, we can't fetch balance
      if (!publicKey || !connection) {
        setBalance(0);  // Reset balance to 0 when wallet disconnects
        return;
      }

      // STEP 2: Set loading state to indicate balance fetch is in progress
      // This provides visual feedback to users that balance is being updated
      setIsLoading(true);
      
      try {
        // STEP 3: Query Solana blockchain for OVL token accounts
        // We use getParsedTokenAccountsByOwner to find all token accounts that:
        // - Are owned by the connected wallet (publicKey)
        // - Contain the specific OVL token mint (SOLANA_OVL_MINT)
        // 
        // The 'parsed' version automatically decodes the account data into human-readable format
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: new PublicKey(SOLANA_OVL_MINT) }
        );

        // STEP 4: Handle the case where no OVL token account exists
        // This can happen if:
        // - The wallet has never held OVL tokens
        // - The wallet transferred all OVL tokens to another address
        // - The wallet is on a different network (testnet vs mainnet)
        if (tokenAccounts.value.length === 0) {
          setBalance(0);  // No OVL tokens found
        } else {
          // STEP 5: Extract the actual token balance from the account data
          // Solana stores token amounts with decimals, so we need to access the parsed info
          // The balance is stored in: account.data.parsed.info.tokenAmount.uiAmount
          // - uiAmount: Human-readable amount (e.g., 100.5 instead of 100500000)
          // - amount: Raw amount in smallest units (e.g., 100500000 for 100.5 tokens)
          // - decimals: Number of decimal places (e.g., 6 for OVL tokens)
          const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
          
          // Update the balance state with the fetched value
          // If balance is null/undefined (edge case), default to 0
          setBalance(balance || 0);
        }
        
      } catch (error) {
        // STEP 6: Error handling for network or blockchain issues
        // Common errors include:
        // - Network connectivity issues
        // - RPC endpoint rate limiting
        // - Invalid wallet address format
        // - Blockchain node synchronization issues
        console.error("Error fetching Solana OVL balance:", error);
        
        // Set balance to 0 on error to prevent displaying stale/invalid data
        setBalance(0);
        
      } finally {
        // STEP 7: Always reset loading state, regardless of success or failure
        // This ensures the UI doesn't get stuck in a loading state
        setIsLoading(false);
      }
    };

    // Execute the balance fetch function immediately when the effect runs
    fetchBalance();
    
  }, [publicKey, connection]); // Dependencies: re-run effect when these values change

  // Return the hook's public interface
  return { 
    balance,      // Current OVL token balance (number)
    isLoading     // Loading state indicator (boolean)
  };
}
