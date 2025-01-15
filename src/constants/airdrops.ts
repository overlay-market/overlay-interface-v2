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
export const SABLIER_VESTING_URL = 'https://app.sablier.com/vesting/stream/'

export type ClaimMap = {[claimId: string]: string}

export const MERKLE_DISTIBUTOR_ADDRESSES: ClaimMap = {
  [ClaimId.BEACON_HOLDERS]: '0xe00a6444686988C809bEa59bC8a18EA298a6A0a1',
  [ClaimId.OVERLAY]: '0x36D6136b9e0372Fe9dE42BD21311890bFb523246',
  [ClaimId.GEARBOX]: '0xD2e5B1b0887ADeC2Df2b1Fb69ff3F469E9Fe71f7',
  [ClaimId.SENSE_FINANCE]: '0x5a0B95E113B6713eD3dE69E47af4a946F9538b8a',
  [ClaimId.NFT_PERP]: '0x5e65a55ded8177b4207dF49ea0AB5961E8461013',
  [ClaimId.AMBIRE_WALLET]: '0xFEEcE52a76Af04B77187Ab88d7C00310Df0249fE',
  [ClaimId.ARBITRUM_AMA]: '0x769dECe63871B82c127Bd845afA1f149921AFf71',
  [ClaimId.ELEMENT_FINANCE]: '',
  [ClaimId.GMX]: '',
  [ClaimId.COW_SWAP]: '',
  [ClaimId.ARBITRUM]: '',
  [ClaimId.TESTING_A]: '0xB5Fd24fB1C311b78626032F6734911c13Ab86E30',
  [ClaimId.TESTING_B]: '0xDC33c6E189cA5EB0aa684A85770582d49B60df60',
  [ClaimId.LB4]: '0x9d16fBEc655bd33bf19DB09621dFBE1A00e3787F',
  [ClaimId.OVL_TO_OV]: '0x5991a31ab4095cb5470a5bd532e02568393b06d5',
  [ClaimId.RETRO]: '0x5991a31ab4095cb5470a5bd532e02568393b06d5',
}

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
    status: AirdropStatus.TBA,
  },
  // [ClaimId.ARBITRUM]: {
  //   title: ClaimId.ARBITRUM,
  //   expectedDate: '23.12.2023',
  //   summary: 'This airdrop is for Overlay OG’s who joined before 2022',
  //   status: AirdropStatus.TBA,
  // },
}
