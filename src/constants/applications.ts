import { TokenAmount } from "@lifi/sdk";
import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import { DEFAULT_CHAINID, SUPPORTED_CHAINID } from "./chains";
import { Address } from "viem";
import { OVL_ADDRESS } from "overlay-sdk";

export enum MARKET_CHART_URL {
  BSC_TESTNET = "https://api.overlay.market/bsc-testnet-charts/v1/charts",
  BSC_MAINNET = "https://api.overlay.market/bsc-charts/v1/charts",
  DEFAULT = "https://api.overlay.market/charts/v1/charts",
}

export const REFERRAL_API_BASE_URL = "https://api.overlay.market/referral";
export const DATA_API_BASE_URL =
  import.meta.env.VITE_DATA_API_BASE_URL ||
  "https://api.overlay.market/data/api";

export const DEFAULT_MARKET_ID = encodeURIComponent("BTC Dominance");
export const DEFAULT_MARKET = "BTC Dominance";

export const TRADE_POLLING_INTERVAL = 30000;

// Market data polling configuration for combined bid/ask + PnL updates
export const MARKET_DATA_POLLING_INTERVAL = 10000; // 10 seconds
export const MARKET_DATA_CACHE_TTL = 15000; // 15 seconds (1.5x polling interval)

export const UNIT = "OVL";

export enum NAVBAR_MODE {
  BURGER = "burger",
  DEFAULT = "default",
}

export const LEADERBOARD_API = 'https://api.overlay.market/leaderboard/'

export const PERMANENT_LEADERBOARD_API = LEADERBOARD_API + 'permanent/'

export const FAUCET_API = 'https://api.overlay.market/faucet/'

export const FUNDED_TRADER_API = import.meta.env.VITE_FUNDED_TRADER_API || 'https://api.overlay.market/funded-traders'

export type AddressMap = { [chainId: number]: Address };

export const REFERRAL_LIST_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: '0xd36a37a5c116ef661a84bd2314b4ef59e1a0f307',
}

export const REFERRAL_CLAIM_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: '0xb80346e4c7bfa4f44b1ff64f6c962aea055ebcf9',
}

export const REWARDS_API = 'https://api.overlay.market/rewards'

export const SHIVA_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: "0xeB497c228F130BD91E7F13f81c312243961d894A",
  [SUPPORTED_CHAINID.BSC_TESTNET]: "0x9fB7D92526Fc13bB3c0603d39E55e5C371c26Ce6",
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

export const OVL_DECIMALS = 18;

export const GA_TRACKING_ID = "G-LBE2VY2GPX";
