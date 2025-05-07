import { Address } from "viem";
import { TOKENS, VaultItemType } from "../constants/vaults";

export interface RewardToken {
  rewardTokenName: TOKENS; 
  rewardTokenAddress: Address;
}

export interface VaultItem {
  id: number;
  vaultType: VaultItemType;
  vaultAddress: Address;
  rewardTokens: RewardToken[];
}

export interface StaticVaultData {
  id: number;
  vaultName: string;
  combinationType: VaultItemType[];
  vaultItems: number[]; 
}

export interface FetchedIchiVaultData {
  id: number;
  feeApr_7d: string;
  holdersCount: number;
  totalAmount0: bigint;
  totalAmount1: bigint;
  token0: Address;
  token1: Address;
}

export interface CalculatedVaultData {
  id: number;
  ichiApr?: string;
  multiRewardApr?: string;
  totalApr: string;
  stakersCount: number;
  tvl: string;
}

export type PartialVault = Partial<CalculatedVaultData>;
export const MR_types = [VaultItemType.MR_SINGLE, VaultItemType.MR_DUAL]

export interface UserCurrentBalance {
  tokenSymbol: string;
  amount: string;
  tokenValue: string | number;
}