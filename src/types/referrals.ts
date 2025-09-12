export type ReferralAccountQueryVariables = {
  account: string; 
};

export type ReferralAccountQuery = {
  account?: {
    id: string;
    ovlVolumeTraded: string;
    referralPositions: Array<{
      id: string;
      tier: number;
      totalAffiliateComission: string;
      totalAirdroppedAmount: string;
      totalRewardsPending: string;
      totalTraderDiscount: string;
      accountsReferred: number;
      affiliatedTo?: {
        id: string;
      } | null;
    }>;
  } | null;
};