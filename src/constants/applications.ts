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

export const DEFAULT_MARKET_ID = encodeURIComponent("BTC Dominance");
export const DEFAULT_MARKET = "BTC Dominance";

export const TRADE_POLLING_INTERVAL = 30000;

export const UNIT = "OVL";

export enum NAVBAR_MODE {
  BURGER = "burger",
  DEFAULT = "default",
}

export const LEADERBOARD_API = 'https://api.overlay.market/leaderboard/'

export const PERMANENT_LEADERBOARD_API = LEADERBOARD_API + 'permanent/'

export const FAUCET_API = 'https://api.overlay.market/faucet/'

export type AddressMap = { [chainId: number]: Address };

export const REFERRAL_LIST_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: '0xa19338c002a065f4dc3ad1949738ccdc4b10061d',
}

export const REFERRAL_CLAIM_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: '0x8de4a375a373444e6737ef89ff86366e0e22da43',
}

export const REWARDS_API = 'https://api.overlay.market/rewards'

export const SHIVA_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: "0xeB497c228F130BD91E7F13f81c312243961d894A",
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
