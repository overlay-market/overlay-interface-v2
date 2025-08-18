export enum ClaimId {
  TUNA = 'TUNA',
  OG_PCD = 'OG_PCD',
  FJORD_BUYERS = 'FJORD_BUYERS',
  TORCH = 'TORCH',
  DAO = 'DAO',
}

export const AIRDROP_CHECKER_API = 'https://api.overlay.market/airdrop-checker/'
export const SABLIER_VESTING_URL = 'https://app.sablier.com/airdrops/campaign/'
export const SABLIER_SUBGRAPH_URL =  `https://api.studio.thegraph.com/query/57079/sablier-v2-arbitrum/version/latest`
export const AIRDROP_LEARN_MORE_LINK = `https://mirror.xyz/0x7999C7f0b9f2259434b7aD130bBe36723a49E14e/Q5OmkZ7eXCZ8AgrDy37IaLfTQouVR9R1U3mmiRDDdz8`

export type ClaimMap = {[claimId: string]: string}

export const MERKLE_DISTIBUTOR_ADDRESSES: ClaimMap = {
  [ClaimId.TUNA]: '0x63d139e7c969e584485c08d995723dee72026895-56',
  [ClaimId.OG_PCD]: '0x80d03e83883cab55256ce51da74925e6693e19ea-56',
  [ClaimId.FJORD_BUYERS]: '0x5200660d504e84754ef55bfb46fdec3b932e916a-56',
  [ClaimId.TORCH]: '',
  [ClaimId.DAO]: '',
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
  },
  [ClaimId.DAO]: {
    title: 'DAO',
    status: AirdropStatus.ACTIVATED,
  },
}
