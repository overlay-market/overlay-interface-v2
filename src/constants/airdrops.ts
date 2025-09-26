export enum ClaimId {
  TUNA = 'TUNA',
  OG_PCD = 'OG_PCD',
  FJORD_BUYERS = 'FJORD_BUYERS',
  TORCH = 'TORCH',
  TORCH1 = 'TORCH-V1',
  TORCH2 = 'TORCH-V2',
  TORCH3 = 'TORCH-V3',
  OG_CONVERSION = 'DAO',
}

export const AIRDROP_CHECKER_API = 'https://api.overlay.market/airdrop-checker/'
export const SABLIER_VESTING_URL = 'https://app.sablier.com/airdrops/campaign/'
export const SABLIER_SUBGRAPH_URL =  `https://api.studio.thegraph.com/query/57079/sablier-v2-arbitrum/version/latest`
export const AIRDROP_LEARN_MORE_LINK = `https://mirror.xyz/0x7999C7f0b9f2259434b7aD130bBe36723a49E14e/Q5OmkZ7eXCZ8AgrDy37IaLfTQouVR9R1U3mmiRDDdz8`

export type ClaimMap = {[claimId: string]: string}

export const MERKLE_DISTIBUTOR_ADDRESSES: ClaimMap = {
  [ClaimId.TUNA]: '0x63d139e7c969e584485c08d995723dee72026895-56',
  [ClaimId.OG_PCD]: '0x11f54999cf86fB7d0c599fdAA463290290A54F3b-56',
  [ClaimId.FJORD_BUYERS]: '0x1F96e8E650B54CA69A4974aC14e7dbEDa34C1f39-56',
  [ClaimId.TORCH]: 'https://docs.overlay.market/Token/TORCH%20Airdrop',
  [ClaimId.TORCH1]: '0xd4016a02b33a850f334d7f8b2ce7276901ff0aaa-56',
  [ClaimId.TORCH2]: '0x92ecC9b5bd23eF60eBD3abaFC1DfEbE04024c0E9-56',
  [ClaimId.TORCH3]: '0x62f61551fa94a2384a4bcfc86cf603c227cde4d9-56',
  [ClaimId.OG_CONVERSION]: '',
}

export enum AirdropStatus {
  ACTIVATED = 'Activated',
  COMING_SOON = 'Coming soon',
}

export type AirdropType = {
  title: string
  status: AirdropStatus
  subtitle?: string
}

export type AirdropMap = {
  [key: string]: AirdropType
}

export const AIRDROPS: AirdropMap = {
  [ClaimId.FJORD_BUYERS]: {
    title: 'Fjord Buyers',
    status: AirdropStatus.ACTIVATED,
  },
  [ClaimId.TUNA]: {
    title: 'TUNA',
    status: AirdropStatus.ACTIVATED,
  },
  [ClaimId.OG_PCD]: {
    title: 'OG + PCD',
    status: AirdropStatus.ACTIVATED,
  },
  [ClaimId.TORCH]: {
    title: 'TORCH',
    status: AirdropStatus.ACTIVATED,
    subtitle: 'Follow instructions ->'
  },
  [ClaimId.TORCH1]: {
    title: 'TORCH',
    status: AirdropStatus.ACTIVATED,
    subtitle: 'Claim Now!'
  },
  [ClaimId.TORCH2]: {
    title: 'TORCH',
    status: AirdropStatus.ACTIVATED,
    subtitle: 'Claim Now!'
  },
  [ClaimId.TORCH3]: {
    title: 'TORCH',
    status: AirdropStatus.ACTIVATED,
    subtitle: 'Claim Now!'
  },
  [ClaimId.OG_CONVERSION]: {
    title: 'OG Conversion',
    status: AirdropStatus.ACTIVATED,
  },
}
