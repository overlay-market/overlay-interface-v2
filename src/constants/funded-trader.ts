import { ProgramTier, TierColor, TierColorScheme } from '../pages/FundedTrader/types';

export const TIER_COLORS: Record<TierColor, TierColorScheme> = {
  blue: {
    primary: '#12B4FF',
  },
  purple: {
    primary: '#B371FF',
  },
  red: {
    primary: '#FF648A',
  },
  yellow: {
    primary: '#FFC955',
  },
  grey: {
    primary: '#8D8F94',
  },
};

export const PROGRAM_TIERS: ProgramTier[] = [
  {
    id: 'tier-100',
    tierName: '$100 Test',
    fundedAmount: 1000,
    colorAccent: 'blue',
    emoji: '🟦',
    isLocked: false,
    requirements: {
      volumeRequired: '+$2,000',
      profitTarget: '+50%',
      minimumTradingDays: 5,
      timeLimit: 'Unlimited',
    },
    afterPassing: {
      profitSplit: '80%',
      payoutFrequency: '14 days',
      dailyMaxLoss: '25%',
      maxTotalLoss: '50%',
    },
  },
  {
    id: 'tier-250',
    tierName: '$250 Test',
    fundedAmount: 2500,
    colorAccent: 'purple',
    emoji: '🟪',
    isLocked: false,
    requirements: {
      volumeRequired: '+$5,000',
      profitTarget: '+50%',
      minimumTradingDays: 5,
      timeLimit: 'Unlimited',
    },
    afterPassing: {
      profitSplit: '80%',
      payoutFrequency: '14 days',
      dailyMaxLoss: '25%',
      maxTotalLoss: '50%',
    },
  },
  {
    id: 'tier-500',
    tierName: '$500 Test',
    fundedAmount: 5000,
    colorAccent: 'red',
    emoji: '🟥',
    isLocked: false,
    requirements: {
      volumeRequired: '+$10,000',
      profitTarget: '+50%',
      minimumTradingDays: 5,
      timeLimit: 'Unlimited',
    },
    afterPassing: {
      profitSplit: '80%',
      payoutFrequency: '14 days',
      dailyMaxLoss: '25%',
      maxTotalLoss: '50%',
    },
  },
  {
    id: 'tier-1000',
    tierName: '$1,000 Test',
    fundedAmount: 10000,
    colorAccent: 'yellow',
    emoji: '🟨',
    isLocked: false,
    requirements: {
      volumeRequired: '+$20,000',
      profitTarget: '+50%',
      minimumTradingDays: 5,
      timeLimit: 'Unlimited',
    },
    afterPassing: {
      profitSplit: '80%',
      payoutFrequency: '14 days',
      dailyMaxLoss: '25%',
      maxTotalLoss: '50%',
    },
  },
  {
    id: 'tier-scale',
    tierName: 'Scale Tier',
    fundedAmount: 100000,
    colorAccent: 'grey',
    emoji: '🔒',
    isLocked: true,
    requirements: {
      volumeRequired: 'TBD',
      profitTarget: 'TBD',
      minimumTradingDays: 'TBD',
      timeLimit: 'TBD',
    },
    afterPassing: {
      profitSplit: 'TBD',
      payoutFrequency: 'TBD',
      dailyMaxLoss: 'TBD',
      maxTotalLoss: 'TBD',
    },
  },
];

export const IMPORTANT_NOTICE =
  'Double-or-Nothing market is excluded from the funded trader program - Trades at this market will not be counted.';
