import { Address } from "viem"

export interface PrevWeekDetails {
  sessionId: string
  sessionStart: string
  sessionEnd: string
}

export interface SessionDetails {
  sessionStart: string
  sessionEnd: string
  sessionLastUpdated: string
}
export interface UserData {
  _id: string
  totalPoints: number
  previousRunPoints: number
  rank?: number
}
export interface ExtendedUserData extends UserData {
  username?: string
  avatar?: string
}

export interface LeaderboardPointsData {
  previousWeekDetails: PrevWeekDetails
  totalUsers: number
  leaderboardTable: [UserData]
  sessionDetails: SessionDetails
  user?: UserData
}

export interface UserReferralData {
  sessionId: string;
  sessionStart: string;
  sessionEnd: string;
  sessionLastUpdated: string;
  walletAddress: Address;
  sessionTotalPoints: number;
  previousRunPoints: number;
  previousRunWalletBoostBonus: number;
  previousRunReferralBonus: number;
  previousRunAffiliateBonus: number;
  myReferralCode: string | null;
  isEligibleForAffiliate: boolean;
  referrals: { walletAddress: Address }[];
  referredByAffiliate: {
    walletAddress: Address;
    referralCodeUsed: string;
  } | null;
  rank: number;
}