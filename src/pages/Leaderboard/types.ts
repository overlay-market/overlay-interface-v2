export interface UserData {
  walletAddress: string
  seasonId: string
  seasonStart: Date | null
  seasonEnd: Date | null
  totalProfitOVL: number
  totalProfitUSD: number
  totalPositions: number
  totalVolume: string
  mostTradedMarket: {
    marketId: string
    totalVolume: string
  }
  winRate: number
  profitablePositions: number
  lastUpdated: Date | string
  rank: number
}
export interface ExtendedUserData extends UserData {
  username?: string
  avatar?: string
}

export interface PermanentLeaderboardData {
  leaderboard: [UserData]
  totalUsers: number
  page: number
  limit: number
  totalpages: number
  userRank?: UserData
}

export const dataForTesting = {
    "leaderboard": [
      {
        "walletAddress": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "seasonId": "all-time",
        "seasonStart": null,
        "seasonEnd": null,
        "totalProfitOVL": 98765.43,
        "totalProfitUSD": 456789.12,
        "totalPositions": 320,
        "totalVolume": "5678",
        "mostTradedMarket": {
          "marketId": "0x679151e1c29d1a848f6ddc2b64fc4b81724c196a",
          "totalVolume": "500000"
        },
        "winRate": 0.82,
        "profitablePositions": 262,
        "lastUpdated": "2025-08-08T10:00:00.000Z",
        "rank": 1
      },
      {
        "walletAddress": "0x34aA3F359A9D614239015126635CE7732c18fDF3",
        "seasonId": "all-time",
        "seasonStart": null,
        "seasonEnd": null,
        "totalProfitOVL": 87654.32,
        "totalProfitUSD": 345678.91,
        "totalPositions": 280,
        "totalVolume": "4567",
        "mostTradedMarket": {
          "marketId": "0x3d084117fd13773dc4745d268717e4b4c51972d6",
          "totalVolume": "400000"
        },
        "winRate": 0.78,
        "profitablePositions": 218,
        "lastUpdated": "2025-08-08T10:05:00.000Z",
        "rank": 2
      },
      {
        "walletAddress": "0x5B93FF82faaF241c15997ea3975419DDDd8362c5",
        "seasonId": "all-time",
        "seasonStart": null,
        "seasonEnd": null,
        "totalProfitOVL": 76543.21,
        "totalProfitUSD": 234567.89,
        "totalPositions": 250,
        "totalVolume": "3456",
        "mostTradedMarket": {
          "marketId": "0xe886b759c7811052ef54ccbc7359766a134211fb",
          "totalVolume": "350000"
        },
        "winRate": 0.75,
        "profitablePositions": 187,
        "lastUpdated": "2025-08-08T10:10:00.000Z",
        "rank": 3
      },
      {
        "walletAddress": "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
        "seasonId": "all-time",
        "seasonStart": null,
        "seasonEnd": null,
        "totalProfitOVL": 65432.10,
        "totalProfitUSD": 123456.78,
        "totalPositions": 220,
        "totalVolume": "2345",
        "mostTradedMarket": {
          "marketId": "0x39d6c6d1b3a3cafb2cfd6e753ecc54b316392afa",
          "totalVolume": "300000"
        },
        "winRate": 0.70,
        "profitablePositions": 154,
        "lastUpdated": "2025-08-08T10:15:00.000Z",
        "rank": 4
      },
      {
        "walletAddress": "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        "seasonId": "all-time",
        "seasonStart": null,
        "seasonEnd": null,
        "totalProfitOVL": 54321.09,
        "totalProfitUSD": 98765.43,
        "totalPositions": 180,
        "totalVolume": "1234",
        "mostTradedMarket": {
          "marketId": "0x7ee577fb630e9edd2f5c62e857353545df53a66b",
          "totalVolume": "250000"
        },
        "winRate": 0.68,
        "profitablePositions": 122,
        "lastUpdated": "2025-08-08T10:20:00.000Z",
        "rank": 5
      }
    ],
    "userRank": {
      "walletAddress": "0x983110309620D911731Ac0932219af06091b6744",
      "seasonId": "all-time",
      "seasonStart": null,
      "seasonEnd": null,
      "totalProfitOVL": 43210.98,
      "totalProfitUSD": 87654.32,
      "totalPositions": 150,
      "totalVolume": "1122",
      "mostTradedMarket": {
        "marketId": "0x9cc4fde387c3b0318945e8338c74c8ef31ceed62",
        "totalVolume": "200000"
      },
      "winRate": 0.65,
      "profitablePositions": 98,
      "lastUpdated": "2025-08-08T10:25:00.000Z",
      "rank": 6
    },
    "totalUsers": 500,
    "page": 1,
    "limit": 100,
    "totalPages": 5
  }