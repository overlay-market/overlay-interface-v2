import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletContextState
} from "@solana/wallet-adapter-react";

export function useSolanaWallet(): WalletContextState {
  return useWallet();
}