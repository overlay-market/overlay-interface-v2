/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BARTIO_RPC: string
  readonly VITE_BERACHAIN_RPC: string
  readonly VITE_ARBITRUM_SEPOLIA_RPC: string
  readonly VITE_BEPOLIA_RPC: string
  readonly VITE_BSC_TESTNET_RPC: string
  readonly VITE_BSC_MAINNET_RPC: string
  readonly VITE_SOLANA_RPC_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
