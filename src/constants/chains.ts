import { Chain, defineChain } from "viem";
import { arbitrumSepolia, berachainTestnetbArtio, bscTestnet } from "viem/chains";
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
  BARTIO = 80084,
  BSC_TESTNET = 97,
}

export const DEFAULT_NET = SUPPORTED_CHAINID[421614];
export const DEFAULT_CHAINID: number | Chain = SUPPORTED_CHAINID.ARBITRUM_SEPOLIA;

export const WORKING_CHAINS = [
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.ARBITRUM_SEPOLIA],
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.BSC_TESTNET],
  // SUPPORTED_CHAINID[SUPPORTED_CHAINID.BARTIO],
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
  [SUPPORTED_CHAINID.BARTIO]: berachainTestnetbArtio,
  [SUPPORTED_CHAINID.IMOLA]: imola,
  [SUPPORTED_CHAINID.BSC_TESTNET]: bscTestnet,
};

export const NETWORK_ICONS: {
  [chainId in SUPPORTED_CHAINID | number]: string;
} = {
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: ArbitrumSepoliaLogo,
  [SUPPORTED_CHAINID.IMOLA]: ImolaLogo,
  [SUPPORTED_CHAINID.BARTIO]: BartioLogo,
  [SUPPORTED_CHAINID.BSC_TESTNET]: BartioLogo, // TODO: add bsc testnet logo
};

export const CHAIN_LIST: { [chainId in SUPPORTED_CHAINID | number]: string } = {
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: "Arbitrum Sepolia",
  [SUPPORTED_CHAINID.IMOLA]: "Movement",
  // [SUPPORTED_CHAINID.BARTIO]: "Berachain bArtio",
  [SUPPORTED_CHAINID.BSC_TESTNET]: "BSC Testnet",
};

export const CHAIN_LIST_ORDER: { [x: number]: number } = {
  // [0]: SUPPORTED_CHAINID.BARTIO,
  [1]: SUPPORTED_CHAINID.ARBITRUM_SEPOLIA,
  [2]: SUPPORTED_CHAINID.BSC_TESTNET,
};
