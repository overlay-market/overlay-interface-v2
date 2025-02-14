export enum ClaimId {
  BEACON_HOLDERS = 'BEACON_HOLDERS',
  OVERLAY = 'OVERLAY',
  RETRO = 'retro',
  OVL_TO_OV = 'OVL_TO_OV',
  TUNA_CAMPAIGN = 'TUNA_CAMPAIGN',
  OG = 'OG',
}

export const AIRDROP_CHECKER_API = 'https://api.overlay.market/airdrop-checker/'
export const SABLIER_VESTING_URL = 'https://app.sablier.com/vesting/stream/'
export const SABLIER_SUBGRAPH_URL =  `https://api.studio.thegraph.com/query/57079/sablier-v2-arbitrum/version/latest`
export const AIRDROP_LEARN_MORE_LINK = `https://mirror.xyz/0x7999C7f0b9f2259434b7aD130bBe36723a49E14e/Q5OmkZ7eXCZ8AgrDy37IaLfTQouVR9R1U3mmiRDDdz8`

export type ClaimMap = {[claimId: string]: string}

export const MERKLE_DISTIBUTOR_ADDRESSES: ClaimMap = {
  [ClaimId.BEACON_HOLDERS]: '0xe00a6444686988C809bEa59bC8a18EA298a6A0a1',
  [ClaimId.OVERLAY]: '0x36D6136b9e0372Fe9dE42BD21311890bFb523246',
  [ClaimId.OVL_TO_OV]: '0x5991a31ab4095cb5470a5bd532e02568393b06d5',
  [ClaimId.RETRO]: '0x5991a31ab4095cb5470a5bd532e02568393b06d5',
  [ClaimId.TUNA_CAMPAIGN]: '0x5991a31ab4095cb5470a5bd532e02568393b06d5',
  [ClaimId.OG]: '0x5991a31ab4095cb5470a5bd532e02568393b06d5',
}

export enum AirdropStatus {
  ACTIVATED = 'Activated',
  COMING_SOON = 'Coming soon',
}

export type AirdropType = {
  title: string
  status: AirdropStatus
}

export type AirdropMap = {
  [key: string]: AirdropType
}

export const AIRDROPS: AirdropMap = {
  [ClaimId.OVL_TO_OV]: {
    title: 'TUNA Campaign',
    status: AirdropStatus.ACTIVATED,
  },
  // [ClaimId.RETRO]: {
  //   title: 'Airdrop',
  //   status: AirdropStatus.ACTIVATED,
  // },
  // [ClaimId.TUNA_CAMPAIGN]: {
  //   title: 'TUNA Campaign',
  //   status: AirdropStatus.ACTIVATED,
  // },
  // [ClaimId.OG]: {
  //   title: 'OG',
  //   status: AirdropStatus.ACTIVATED,
  // },
  [ClaimId.BEACON_HOLDERS]: {
    title: 'beacon holders',
    status: AirdropStatus.ACTIVATED,
  },
}
