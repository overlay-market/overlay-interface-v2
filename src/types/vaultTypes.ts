import { Address } from "viem";
import { TOKENS } from "../constants/vaults";

export interface StaticVaultData {
  vaultAddress: {
    poolVault: Address;
    rewardsVault: Address;
  };
  vaultName: string;
  rewardTokens: {
      rewardTokenName: TOKENS;
      rewardTokenAddress: Address;
    }[]
}

export interface FetchedVaultData {
  id: Address;
  feeApr_7d: string;
  holdersCount: number;
  totalAmount0: bigint;
  totalAmount1: bigint;
  token0: Address;
  token1: Address;
}

export interface CalculatedVaultData {
  poolVaultAddress: string;
  poolApr: string;
  rewardsApr: string;
  totalApr: string;
  stakersCount: number;
  tvl: string;
}

export type PartialVault = Partial<CalculatedVaultData>;

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