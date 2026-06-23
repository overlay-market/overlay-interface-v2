import { http, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'
import { safe } from 'wagmi/connectors'
import { mainnetChains } from './chains';
import { isTestnetMode } from '../../constants/chains';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string

const chains = isTestnetMode ? [bsc, bscTestnet, ...mainnetChains] as const : [bsc, ...mainnetChains] as const;

const transports = Object.fromEntries(
  chains.map((chain) => [
    chain.id,
    chain.id === bsc.id
      ? http(import.meta.env.VITE_BSC_MAINNET_RPC) // custom for BSC mainnet
      : chain.id === bscTestnet.id
        ? http() // default RPC for BSC testnet
        : http()
  ])
);

const configOptions = getDefaultConfig({
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
});

export const wagmiConfig = createConfig({
  ...configOptions,
  connectors: [
    ...(configOptions.connectors || []),
    safe(),
  ],
})
