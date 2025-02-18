export interface VaultDetails {
  vaultAddress: string;
  totalSupply: number;
  // apr: number;
  userRewards: {
    rewardA: number;
    rewardB?: number;
  } | null;
}