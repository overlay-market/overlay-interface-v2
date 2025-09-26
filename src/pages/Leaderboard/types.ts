export interface MostTradedMarket {
  marketId: string;
  totalVolume: string;
}

export interface UserData {
  _id: string;
  walletAddress: string;
  seasonId: string;
  seasonStart: string | null;
  seasonEnd: string | null;
  mostTradedMarket: MostTradedMarket;
  profitablePositions: number;
  rank: number;
  rankByVolume: number | null;
  rankByFees: number | null;
  lastUpdated: string; 
  totalFeesOVL: number | string;
  totalFeesUSD: number | string;
  totalPositions: number;
  totalProfitOVL: number | string;
  totalProfitUSD: number | string;
  totalVolumeOVL: number | string;
  totalVolumeUSD: number | string;
  winRate: number | string;
}
export interface ExtendedUserData extends UserData {
  username?: string
  avatar?: string
}

export interface PermanentLeaderboardData {
  leaderboard: UserData[];
  totalUsers: number;
  page: number;
  limit: number;
  totalPages: number;
  userRank?: UserData | null;
  lastUpdated: string;
}

export interface Season {
  id: string;
  name: string;
  type?: string;
  start?: string | null;
  end?: string | null;
  active?: boolean;
  hasData?: boolean;
}

export type ColumnKey =
  | "profitOVL"
  | "profitUSD"
  | "positions"
  | "mostTradedMarket"
  | "winRate"
  | "volume"
  | "fees";

export type DisplayUserData = ExtendedUserData & {
  marketId?: string;
  marketName?: string;
};

export interface ColumnDef {
  value: ColumnKey;
  label: string;
  render: (data: DisplayUserData) => React.ReactNode;
}

export interface MarketInfo {
  id: string;
  marketId: string;
  marketName: string;
}

export enum Ranking {
  ByProfit = "profit",
  ByVolume = "volume",
}
