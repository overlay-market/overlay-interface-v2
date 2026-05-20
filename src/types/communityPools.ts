export interface CommunityPoolChain {
  chainId: number;
  chainName: string;
  explorerUrl: string;
}

export interface CommunityPoolContributionToken {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
}

export interface CommunityPool {
  _id: string;
  slug: string;
  marketName: string;
  tokenSymbol: string;
  tokenName?: string;
  logoUrl?: string;
  safeAddress: `0x${string}`;
  chain: CommunityPoolChain;
  contributionToken: CommunityPoolContributionToken;
  targetAmountRaw: string;
  startsAt?: string;
  endsAt?: string;
  sortOrder?: number;
  isDraft: boolean;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CommunityPoolStatus = "open" | "funded" | "expired";
