import { TokenAmount } from "@lifi/sdk";
import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import { DEFAULT_CHAINID, SUPPORTED_CHAINID } from "./chains";
import { Address } from "viem";

export enum MARKET_CHART_URL {
  SEPOLIA = "https://api.overlay.market/sepolia-charts/v1/charts",
  IMOLA = "https://api.overlay.market/imola-charts/v1/charts",
  BARTIO = "https://api.overlay.market/bartio-charts/v1/charts",
  BSC_TESTNET = "https://api.overlay.market/bsc-testnet-charts/v1/charts",
  DEFAULT = "https://api.overlay.market/charts/v1/charts",
}

export const DEFAULT_MARKET = "BTC Dominance";

export const TRADE_POLLING_INTERVAL = 30000;

export const UNIT = "OVL";

export enum NAVBAR_MODE {
  BURGER = "burger",
  DEFAULT = "default",
}

export const LEADERBOARD_POINTS_API = 'https://api.overlay.market/points-bsc/points/leaderboard'
export const REFERRAL_API_BASE_URL = "https://api.overlay.market/points-bsc";

export const FAUCET_API = 'https://api.overlay.market/faucet/'

export type AddressMap = { [chainId: number]: Address };

export const OVL_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: "0x3E27fAe625f25291bFda517f74bf41DC40721dA2",
  [SUPPORTED_CHAINID.IMOLA]: "0xCde46284D32148c4D470fA33BA788710b3d21E89",
  [SUPPORTED_CHAINID.BARTIO]: "0x97576e088f0d05EF68cac2EEc63d017FE90952a0",
  [SUPPORTED_CHAINID.BSC_TESTNET]: "0xb880E767739A82Eb716780BDfdbC1eD7b23BDB38",
};

export const SHIVA_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_TESTNET]: "0x6385C8b971e822CB02Ced25FCe9aA9604Bed213c",
};

export const DEFAULT_TOKEN_SYMBOL = "OVL";
export const DEFAULT_TOKEN_LOGO = OVLToken;
export const DEFAULT_TOKEN = {
  amount: 0n,
  blockNumber: 0n,
  address: OVL_ADDRESS[DEFAULT_CHAINID],
  chainId: DEFAULT_CHAINID,
  decimals: 18,
  symbol: DEFAULT_TOKEN_SYMBOL,
  logoURI: DEFAULT_TOKEN_LOGO,
  name: "Overlay",
} as TokenAmount;

export const OVL_USD_PRICE = 1.01;
export const OVL_DECIMALS = 18;