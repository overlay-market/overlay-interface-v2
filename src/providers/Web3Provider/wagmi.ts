import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [bscTestnet],
    transports: {
      [bscTestnet.id]: http(),
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
