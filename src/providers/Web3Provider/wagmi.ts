import { http, createConfig } from 'wagmi'
import { berachainTestnetbArtio } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const projectId = "dda9a3559d19c50cf9c8f54edc61ca52"

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [berachainTestnetbArtio],
    transports: {
      [berachainTestnetbArtio.id]: http(),
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
