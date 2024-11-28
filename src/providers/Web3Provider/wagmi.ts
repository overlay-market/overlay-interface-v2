import { http, createConfig } from 'wagmi'
import { arbitrumSepolia, berachainTestnetbArtio } from 'wagmi/chains'
import { imola } from '../../constants/chains'
import { getDefaultConfig } from 'connectkit'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [arbitrumSepolia, berachainTestnetbArtio, imola],
    transports: {
      [arbitrumSepolia.id]: http(),
      [berachainTestnetbArtio.id]: http(),
      [imola.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: projectId,

    // Required App Info
    appName: "Overlay",

    // Optional App Info
    appDescription: "Overlay Protocol",
    appUrl: "https://overlay.market", // your app's url
    appIcon: "https://overlay.market/Overlay-logo.jpg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)
