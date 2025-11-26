import { Chain } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import BscTestnetLogo from "../assets/images/bsc-testnet-logo.webp";

export const isTestnetMode = import.meta.env.VITE_TESTNET_MODE === 'true';

export enum SUPPORTED_CHAINID {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97
}

export const DEFAULT_NET = isTestnetMode ? "TESTNET" : "BSC";
export const DEFAULT_CHAINID: number = isTestnetMode ? SUPPORTED_CHAINID.BSC_TESTNET : SUPPORTED_CHAINID.BSC_MAINNET;
export const DEFAULT_CHAIN_LOGO = BscTestnetLogo;

export const WORKING_CHAINS = isTestnetMode
  ?
    [
      SUPPORTED_CHAINID[SUPPORTED_CHAINID.BSC_TESTNET]
    ]
  :
    [
      SUPPORTED_CHAINID[SUPPORTED_CHAINID.BSC_MAINNET],
    ]

export const VIEM_CHAINS: { [key: number]: Chain } = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: bsc,
  [SUPPORTED_CHAINID.BSC_TESTNET]: bscTestnet,
};

export const NETWORK_ICONS: {
  [chainId in SUPPORTED_CHAINID | number]: string;
} = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: BscTestnetLogo,
  [SUPPORTED_CHAINID.BSC_TESTNET]: BscTestnetLogo,
};

export const CHAIN_LIST: { [chainId in SUPPORTED_CHAINID | number]: string } = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: "BSC",
  [SUPPORTED_CHAINID.BSC_TESTNET]: "BSC Testnet"
};

export const CHAIN_LIST_ORDER: { [x: number]: number } = {
  [0]: SUPPORTED_CHAINID.BSC_TESTNET,
  [1]: SUPPORTED_CHAINID.BSC_MAINNET,
};
