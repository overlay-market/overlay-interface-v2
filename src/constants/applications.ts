export enum MARKET_CHART_URL {
  SEPOLIA = "https://api.overlay.market/sepolia-charts/v1/charts",
  IMOLA = "https://api.overlay.market/imola-charts/v1/charts",
  BARTIO = "https://api.overlay.market/bartio-charts/v1/charts",
  DEFAULT = "https://api.overlay.market/charts/v1/charts",
}

export const DEFAULT_MARKET_ID = encodeURIComponent("BTC Dominance");

export const TRADE_POLLING_INTERVAL = 30000;

export const UNIT = "OVL";

export enum NAVBAR_MODE {
  BURGER = "burger",
  DEFAULT = "default",
}

export const LEADERBOARD_POINTS_API = 'https://api.overlay.market/point-system/points/leaderboard'
