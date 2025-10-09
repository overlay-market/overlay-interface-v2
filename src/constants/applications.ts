import { TokenAmount } from "@lifi/sdk";
import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import { DEFAULT_CHAINID, SUPPORTED_CHAINID } from "./chains";
import { Address } from "viem";
import { CHAINS, OVL_ADDRESS } from "overlay-sdk";

export enum MARKET_CHART_URL {
  BSC_TESTNET = "https://api.overlay.market/bsc-testnet-charts/v1/charts",
  BSC_MAINNET = "https://api.overlay.market/bsc-charts/v1/charts",
  DEFAULT = "https://api.overlay.market/charts/v1/charts",
}

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

export const SHIVA_ADDRESS: AddressMap = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: "0xeB497c228F130BD91E7F13f81c312243961d894A",
};

export const V1_PERIPHERY_ADDRESS: AddressMap = {
  [CHAINS.ArbitrumSepolia]: "0x2878837ea173e8bd40db7cee360b15c1c27deb5a",
  [CHAINS.Imola]: "0x0CA6128B528f503C7c649ba9cc02560a8B9fD55e",
  [CHAINS.Bartio]: "0x4f69dfb24958fcf69b70bca73c3e74f2c82bb405",
  [CHAINS.BerachainMainnet]: "0x2a154ebA61A182e726a540ae2856fc012106e763",
  [CHAINS.Bepolia]: "0xC50C7a502e6aE874A6299f385F938aF5C30CB91d",
  [CHAINS.BscTestnet]: "0x81BdBf6C69882Fe7c958018D3fF7FcAcb59EF8b7",
  [CHAINS.BscMainnet]: "0x10575a9C8F36F9F42D7DB71Ef179eD9BEf8Df238",
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