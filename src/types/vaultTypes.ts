export interface VaultDetails {
  vaultAddress: string;
  totalSupply: number;
  // apr: number;
  // stakers: number;
  // totalRewards: number;
  userRewards: {
    rewardA: number;
    rewardB?: number;
  } | undefined;
}

export interface UserStats {
  currentBalance: number;
  // earnedRewards: {
  //   rewardA: number;
  //   rewardB?: number;
  // } | undefined;
}