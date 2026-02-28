export interface ProgramTier {
  id: string;
  tierName: string;
  fundedAmount: number;
  colorAccent: TierColor;
  emoji: string;
  isLocked: boolean;
  requirements: {
    volumeRequired: string;
    profitTarget: string;
    minimumTradingDays: number | string;
    timeLimit: string;
  };
  afterPassing: {
    profitSplit: string;
    payoutFrequency: string;
    dailyMaxLoss: string;
    maxTotalLoss: string;
  };
}

export type TierColor = 'blue' | 'purple' | 'red' | 'yellow' | 'grey';

export interface TierColorScheme {
  primary: string;
}
