export interface LossLimit {
  thresholdPercent: number;
  currentLossPercent: number;
  thresholdValueUsdt: string;
}

export interface FundedHealth {
  currentValueUsdt: string;
  initialFundingUsdt: string;
  dailyBaselineUsdt: string;
  maxLossLimit: LossLimit;
  dailyLossLimit: LossLimit;
}

export interface FundedPhaseStats {
  phase: "funded";
  safeAddress: string;
  planName?: string;
  health: FundedHealth;
  tradingDays: number;
}

export interface ProfitTarget {
  targetPercent: number;
  currentPercent: number;
}

export interface VolumeTarget {
  targetUsdt: string;
  currentUsdt: string;
}

export interface MinTradingDaysTarget {
  target: number;
  current: number;
}

export interface EvaluationTargets {
  profitTarget: ProfitTarget;
  volumeTarget: VolumeTarget;
  minTradingDays: MinTradingDaysTarget;
}

export interface EvaluationPhaseStats {
  phase: "evaluation";
  safeAddress: string;
  planName?: string;
  currentValueUsdt: string;
  initialFundingUsdt: string;
  targets: EvaluationTargets;
  tradingDays: number;
}

export type FundedTraderStatsData = FundedPhaseStats | EvaluationPhaseStats;
