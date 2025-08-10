import { Chain } from "viem";
import { bsc } from "viem/chains";
import BscTestnetLogo from "../assets/images/bsc-testnet-logo.webp";

export enum SUPPORTED_CHAINID {
  BSC_MAINNET = 56
}

export const DEFAULT_NET = SUPPORTED_CHAINID[56];
export const DEFAULT_CHAINID: number | Chain = SUPPORTED_CHAINID.BSC_MAINNET;

export const WORKING_CHAINS = [
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.BSC_MAINNET]
];

export const VIEM_CHAINS: { [key: number]: Chain } = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: bsc,
};

export const NETWORK_ICONS: {
  [chainId in SUPPORTED_CHAINID | number]: string;
} = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: BscTestnetLogo,
};

export const CHAIN_LIST: { [chainId in SUPPORTED_CHAINID | number]: string } = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: "BSC"
};

export const CHAIN_LIST_ORDER: { [x: number]: number } = {
  [0]: SUPPORTED_CHAINID.BSC_MAINNET,
};
