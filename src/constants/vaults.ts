import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import USDCToken from "../assets/images/token-logos/USDC-token.webp";
import BGTToken from "../assets/images/token-logos/BGT-token.webp";
import { VaultData } from "../types/vaultTypes";

export enum TOKENS {
  USDC = 'USDC', 
  OVL = 'OVL',
  BGT = 'BGT',
}

export const TOKEN_LOGOS: { [key in TOKENS]: string } = {
  [TOKENS.USDC]: USDCToken,
  [TOKENS.OVL]: OVLToken,
  [TOKENS.BGT]: BGTToken,
}

export const DEFAULT_TOKEN_LOGO = OVLToken

export const BERA_VAULTS_SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/88584/berachain-v2-kodiak/version/latest'

export const VAULTS: VaultData[] = [
  {    
    vaultAddress: {
      poolVault: `0x04fD6a7B02E2e48caedaD7135420604de5f834f8`,
      rewardsVault: `0xb9F539d43C894bd335405e2430303594d014356A`,
    },
    vaultName: 'OVL Vault',
    vaultToken: TOKENS.OVL,
  },
  {
    vaultAddress: {
      poolVault: `0x04fD6a7B02E2e48caedaD7135420604de5f834f8`,
      rewardsVault: `0xb9F539d43C894bd335405e2430303594d014356A`,
    },
    vaultName: 'BERA Vault',
    vaultToken: TOKENS.BGT,
  },
]

export interface VaultDataSteer {
  vaultName: string
  vaultAddress: string
}

export const ACTIVE_VAULTS_STEER: VaultDataSteer[] = [
    {
      vaultName: 'USDC-OVL',
      vaultAddress: '0xd6F05636E91Ed40419C1fB8F024FBeef2cD4cd8f',
    },
    {
      vaultName: 'OVL',
      vaultAddress: '0x2A53B7aEDfDaFC7b8e1fEEBcb7C5fe5e7673bA86',
    },
    {
      vaultName: 'BERA-OVL',
      vaultAddress: '0xA8047Ce9C3c8Ec156F0d4Cac4f860b97819d8243',
    },
  ]