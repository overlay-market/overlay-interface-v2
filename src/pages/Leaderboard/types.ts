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
  lastUpdated: string; 
  totalFeesOVL: number | string;
  totalFeesUSD: number | string;
  totalPositions: number;
  totalProfitOVL: number | string;
  totalProfitUSD: number | string;
  totalVolumeOVL: number | string;
  totalVolumeUSD: number | string;
  winRate: number;
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

export interface MarketInfo {
  id: string;
  marketId: string;
  marketName: string;
}

export const dataForTesting = {
  leaderboard: [
    {
      _id: "1",
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      seasonId: "all-time",
      seasonStart: null,
      seasonEnd: null,
      totalProfitOVL: 98765.43,
      totalProfitUSD: 456789.12,
      totalPositions: 320,
      totalVolume: "5678",
      mostTradedMarket: {
        marketId: "0x679151e1c29d1a848f6ddc2b64fc4b81724c196a",
        totalVolume: "500000",
      },
      winRate: 0.82,
      profitablePositions: 262,
      lastUpdated: "2025-08-08T10:00:00.000Z",
      rank: 1,
      totalFeesOVL: 1234.56,
      totalFeesUSD: 7890.12,
      totalVolumeOVL: "5678000",
      totalVolumeUSD: 4567890.12,
    },
    {
      _id: "2",
      walletAddress: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
      seasonId: "all-time",
      seasonStart: null,
      seasonEnd: null,
      totalProfitOVL: 87654.32,
      totalProfitUSD: 345678.91,
      totalPositions: 280,
      totalVolume: "4567",
      mostTradedMarket: {
        marketId: "0x3d084117fd13773dc4745d268717e4b4c51972d6",
        totalVolume: "400000",
      },
      winRate: 0.78,
      profitablePositions: 218,
      lastUpdated: "2025-08-08T10:05:00.000Z",
      rank: 2,
      totalFeesOVL: 1123.45,
      totalFeesUSD: 6789.01,
      totalVolumeOVL: "4567000",
      totalVolumeUSD: 3456789.01,
    },
    {
      _id: "3",
      walletAddress: "0x5B93FF82faaF241c15997ea3975419DDDd8362c5",
      seasonId: "all-time",
      seasonStart: null,
      seasonEnd: null,
      totalProfitOVL: 76543.21,
      totalProfitUSD: 234567.89,
      totalPositions: 250,
      totalVolume: "3456",
      mostTradedMarket: {
        marketId: "0xe886b759c7811052ef54ccbc7359766a134211fb",
        totalVolume: "350000",
      },
      winRate: 0.75,
      profitablePositions: 187,
      lastUpdated: "2025-08-08T10:10:00.000Z",
      rank: 3,
      totalFeesOVL: 1012.34,
      totalFeesUSD: 5678.90,
      totalVolumeOVL: "3456000",
      totalVolumeUSD: 2345678.90,
    },
    {
      _id: "4",
      walletAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
      seasonId: "all-time",
      seasonStart: null,
      seasonEnd: null,
      totalProfitOVL: 65432.10,
      totalProfitUSD: 123456.78,
      totalPositions: 220,
      totalVolume: "2345",
      mostTradedMarket: {
        marketId: "0x39d6c6d1b3a3cafb2cfd6e753ecc54b316392afa",
        totalVolume: "300000",
      },
      winRate: 0.7,
      profitablePositions: 154,
      lastUpdated: "2025-08-08T10:15:00.000Z",
      rank: 4,
      totalFeesOVL: 901.23,
      totalFeesUSD: 4567.89,
      totalVolumeOVL: "2345000",
      totalVolumeUSD: 1234567.89,
    },
    {
      _id: "5",
      walletAddress: "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
      seasonId: "all-time",
      seasonStart: null,
      seasonEnd: null,
      totalProfitOVL: 54321.09,
      totalProfitUSD: 98765.43,
      totalPositions: 180,
      totalVolume: "1234",
      mostTradedMarket: {
        marketId: "0x7ee577fb630e9edd2f5c62e857353545df53a66b",
        totalVolume: "250000",
      },
      winRate: 0.68,
      profitablePositions: 122,
      lastUpdated: "2025-08-08T10:20:00.000Z",
      rank: 5,
      totalFeesOVL: 812.34,
      totalFeesUSD: 3456.78,
      totalVolumeOVL: "1234000",
      totalVolumeUSD: 987654.32,
    },
  ],
  userRank: {
    _id: "6",
    walletAddress: "0x983110309620D911731Ac0932219af06091b6744",
    seasonId: "all-time",
    seasonStart: null,
    seasonEnd: null,
    totalProfitOVL: 43210.98,
    totalProfitUSD: 87654.32,
    totalPositions: 150,
    totalVolume: "1122",
    mostTradedMarket: {
      marketId: "0x9cc4fde387c3b0318945e8338c74c8ef31ceed62",
      totalVolume: "200000",
    },
    winRate: 0.65,
    profitablePositions: 98,
    lastUpdated: "2025-08-08T10:25:00.000Z",
    rank: 6,
    totalFeesOVL: 700.12,
    totalFeesUSD: 2345.67,
    totalVolumeOVL: "1122000",
    totalVolumeUSD: 876543.21,
  },
  totalUsers: 500,
  page: 1,
  limit: 100,
  totalPages: 5,
  lastUpdated: "2025-08-12T18:20:01.399Z",
};