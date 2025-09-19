import { SUPPORTED_CHAINID } from "./chains";

export enum MARKET_CHART_URL {
  BSC_TESTNET = "https://api.overlay.market/bsc-testnet-charts/v1/charts",
  BSC_MAINNET = "https://api.overlay.market/bsc-charts/v1/charts",
  DEFAULT = "https://api.overlay.market/charts/v1/charts",
}

export const REFERRAL_API_BASE_URL = "https://api.overlay.market/referral";

export const DEFAULT_MARKET_ID = encodeURIComponent("BTC Dominance");
export const DEFAULT_MARKET = "BTC Dominance";

export const TRADE_POLLING_INTERVAL = 30000;

export const UNIT = "OVL";

export enum NAVBAR_MODE {
  BURGER = "burger",
  DEFAULT = "default",
}

export const PERMANENT_LEADERBOARD_API = 'https://api.overlay.market/leaderboard/permanent/'

export const FAUCET_API = 'https://api.overlay.market/faucet/'

export type AddressMap = {[chainId: number]: string}

export const REFERRAL_LIST_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: '0xa19338c002a065f4dc3ad1949738ccdc4b10061d',
}

export const REWARDS_API = 'https://api.overlay.market/rewards'