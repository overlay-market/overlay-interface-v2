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

export type TokenTransfersQueryVariables = {
  to: string 
  from: string 
  token: string
}

export type TokenTransfersQuery = {
  tokenTransfers: Array<{
    amount: string
    from: string
    to: string
    transaction: {
      id: string
      timestamp: number
    }
  }>
}