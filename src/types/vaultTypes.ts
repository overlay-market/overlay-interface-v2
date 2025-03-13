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
  currentStakedBalance: string;
  // earnedRewards: {
  //   rewardA: number;
  //   rewardB?: number;
  // } | undefined;
}