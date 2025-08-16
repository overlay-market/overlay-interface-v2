import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

/**
 * SolanaProvider - Context provider for Solana blockchain integration
 * 
 * This provider sets up the complete Solana ecosystem for the application:
 * 1. Network connection (RPC endpoint configuration)
 * 2. Wallet management (Phantom, Solflare, and other Solana wallets)
 * 3. Wallet modal for connection/disconnection flows
 * 4. Auto-connection to previously connected wallets
 * 
 * The provider uses mainnet by default and supports custom RPC endpoints
 * through environment variables for better performance and reliability.
 * 
 * @param children - React components that will have access to Solana context
 * @returns JSX element wrapping children with Solana providers
 */
export const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // STEP 1: Configure the Solana network
  // We use mainnet for production, which is the live Solana blockchain
  // Other options include: Devnet (for testing), Testnet (for staging)
  const network = WalletAdapterNetwork.Mainnet;
  
  // STEP 2: Configure the RPC endpoint with fallback strategy
  // This determines which Solana node the app connects to for blockchain data
  const endpoint = useMemo(() => {
    // Priority 1: Use custom RPC endpoint from environment variables
    // This allows users to configure their own high-performance RPC endpoint
    // Common providers: Alchemy, QuickNode, Helius, etc.
    const customEndpoint = import.meta.env.VITE_SOLANA_RPC_ENDPOINT;
    
    // Priority 2: Fallback to default Solana mainnet endpoint
    // This ensures the app works even without custom configuration
    // Note: Default endpoints may have rate limits or performance issues
    return customEndpoint || clusterApiUrl(network);
  }, [network]);

  // STEP 3: Configure supported Solana wallets
  // These are the wallet applications users can connect to the app
  const wallets = useMemo(
    () => [
      // Phantom Wallet - Most popular Solana wallet with excellent UX
      // Features: Mobile app, browser extension, hardware wallet support
      new PhantomWalletAdapter(),
      
      // Solflare Wallet - Alternative wallet with advanced features
      // Features: Multi-chain support, staking tools, NFT management
      new SolflareWalletAdapter({ network })
    ],
    [network]
  );

  // STEP 4: Render the provider hierarchy
  // The providers must be nested in this specific order for proper functionality
  return (
    // ConnectionProvider: Establishes connection to Solana blockchain
    // This provider gives all child components access to the Solana RPC connection
    <ConnectionProvider endpoint={endpoint}>
      {/* WalletProvider: Manages wallet connections and state */}
      {/* This provider handles wallet connection/disconnection, account switching, etc. */}
      <WalletProvider wallets={wallets} autoConnect>
        {/* WalletModalProvider: Provides wallet selection and connection UI */}
        {/* This provider renders the wallet connection modal and related UI components */}
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
