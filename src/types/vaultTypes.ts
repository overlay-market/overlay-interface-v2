import { Address } from "viem";
import { TOKENS } from "../constants/vaults";

export interface VaultData {
  vaultAddress: {
    poolVault: Address;
    rewardsVault: Address;
  };
  vaultName: string;
  vaultToken: TOKENS;
}

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