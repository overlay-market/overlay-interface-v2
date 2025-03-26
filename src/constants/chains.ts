import { Chain, defineChain } from "viem";
import { arbitrumSepolia, berachainBepolia } from "viem/chains";
import ArbitrumSepoliaLogo from "../assets/images/arbitrum-testnet-logo.webp";
import ImolaLogo from "../assets/images/imola-logo.webp";
import BartioLogo from "../assets/images/bartio-logo.webp";

export enum SUPPORTED_CHAINID {
  MAINNET = 1, //at launch
  RINKEBY = 4, //pre-launch only
  GÖRLI = 5, //pre-launch only
  ARBITRUM = 42161,
  ARBITRUM_GÖRLI = 421613,
  ARBITRUM_SEPOLIA = 421614,
  IMOLA = 30732,
  BEPOLIA = 80069,
}

export const DEFAULT_NET = SUPPORTED_CHAINID[421614];
export const DEFAULT_CHAINID: number | Chain = SUPPORTED_CHAINID.ARBITRUM_SEPOLIA;

export const WORKING_CHAINS = [
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.ARBITRUM_SEPOLIA],
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.BEPOLIA],
];

export const imola = defineChain({
  id: 30732,
  name: "Movement",
  nativeCurrency: {
    decimals: 18,
    name: "MOVE",
    symbol: "MOVE",
  },
  rpcUrls: {
    default: {
      http: ["https://overlay-rpc.devnet.imola.movementnetwork.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.devnet.imola.movementlabs.xyz/#/?network=testnet",
    },
  },
});

export const VIEM_CHAINS: { [key: number]: Chain } = {
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [SUPPORTED_CHAINID.BEPOLIA]: berachainBepolia,
  [SUPPORTED_CHAINID.IMOLA]: imola,
};

export const NETWORK_ICONS: {
  [chainId in SUPPORTED_CHAINID | number]: string;
} = {
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: ArbitrumSepoliaLogo,
  [SUPPORTED_CHAINID.IMOLA]: ImolaLogo,
  [SUPPORTED_CHAINID.BEPOLIA]: BartioLogo,
};

export const CHAIN_LIST: { [chainId in SUPPORTED_CHAINID | number]: string } = {
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: "Arbitrum Sepolia",
  [SUPPORTED_CHAINID.IMOLA]: "Movement",
  [SUPPORTED_CHAINID.BEPOLIA]: "Berachain Bepolia",
};

export const CHAIN_LIST_ORDER: { [x: number]: number } = {
  [0]: SUPPORTED_CHAINID.BEPOLIA,
  [1]: SUPPORTED_CHAINID.ARBITRUM_SEPOLIA,
};
