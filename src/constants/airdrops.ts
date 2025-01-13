export enum ClaimId {
  BEACON_HOLDERS = 'beacon-holders',
  OVERLAY = 'overlay',
  GEARBOX = 'gearbox',
  SENSE_FINANCE = 'sense-finance',
  NFT_PERP = 'nft-perp',
  AMBIRE_WALLET = 'ambire-wallet',
  ELEMENT_FINANCE = 'element-finance',
  GMX = 'gmx',
  COW_SWAP = 'cow-swap',
  ARBITRUM = 'arbitrum',
  ARBITRUM_AMA = 'arbitrum-ama',
  TESTING_A = 'testing-a',
  TESTING_B = 'testing-b',
  LB4 = 'lb4',
  RETRO = 'retro',
  OVL_TO_OV = 'ovl-to-ov',
}

export const AIRDROP_CHECKER_API = 'https://api.overlay.market/airdrop-checker/'


export enum AirdropStatus {
  ACTIVATED = 'Activated',
  COMING_SOON = 'Coming soon',
  TBA = 'TBA',
}

export type AirdropType = {
  title: string
  expectedDate?: string
  summary: string
  boldSummary?: string
  status: AirdropStatus
}

export type AirdropMap = {
  [key: string]: AirdropType
}

export const AIRDROPS: AirdropMap = {
  // [ClaimId.RETRO]: {
  //   title: 'Retro airdrop',
  //   expectedDate: '22.12.2023',
  //   summary: 'If you held OVL on Ethereum or Arbitrum before the Polkastarter launch announcement, you are eligible for OV.',
  //   status: AirdropStatus.ACTIVATED,
  // },
  [ClaimId.OVL_TO_OV]: {
    title: 'OVL -> OV',
    summary: 'If you held OVL on Ethereum or Arbitrum before the Polkastarter launch announcement, you are eligible for OV. ',
    boldSummary: '(25% is available on TGE, and the rest unlocks linearly over 3 months).',
    status: AirdropStatus.COMING_SOON,
  },
  [ClaimId.RETRO]: {
    title: 'Overlay OG',
    summary:
      'If you received Overlay NFTs, PCD, or purchased an Overlay Hoodie, you are eligible for Airdrop 1. Different multipliers apply for each NFT or criteria.',
    boldSummary: '(25% is available on TGE, and the remaining amount unlocks linearly over 3 months).',
    status: AirdropStatus.COMING_SOON,
  },
  [ClaimId.BEACON_HOLDERS]: {
    title: 'beacon holders',
    summary:
      'If you received Overlay NFTs, PCD, or purchased an Overlay Hoodie, you are eligible for Airdrop 1. Different multipliers apply for each NFT or criteria.',
    boldSummary: '(25% is available on TGE, and the remaining amount unlocks linearly over 3 months).',
    status: AirdropStatus.COMING_SOON,
  },
  // [ClaimId.ARBITRUM]: {
  //   title: ClaimId.ARBITRUM,
  //   expectedDate: '23.12.2023',
  //   summary: 'This airdrop is for Overlay OG’s who joined before 2022',
  //   status: AirdropStatus.TBA,
  // },
}
