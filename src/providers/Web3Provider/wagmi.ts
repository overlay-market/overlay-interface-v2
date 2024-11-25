import { http, createConfig } from 'wagmi'
import { arbitrumSepolia, berachainTestnetbArtio } from 'wagmi/chains'
import { injected, walletConnect, safe, coinbaseWallet } from 'wagmi/connectors'
import { imola } from '../../constants/chains'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia, berachainTestnetbArtio, imola],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet(),
    safe(),    
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [berachainTestnetbArtio.id]: http(),
    [imola.id]: http(),
  },
})