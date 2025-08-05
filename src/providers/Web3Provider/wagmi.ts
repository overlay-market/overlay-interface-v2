import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'
import { mainnetChains } from './chains';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string

const chains = [...mainnetChains, bscTestnet] as const;

const transports = Object.fromEntries(
  chains.map((chain) => [chain.id, http()])
);

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains,
    transports,

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
