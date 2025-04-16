import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import USDCToken from "../assets/images/token-logos/USDC-token.webp";
import BGTToken from "../assets/images/token-logos/BGT-token.webp";
import { StaticVaultData } from "../types/vaultTypes";

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

export const VAULTS: StaticVaultData[] = [
  {    
    vaultAddress: {
      poolVault: `0x04fD6a7B02E2e48caedaD7135420604de5f834f8`,
      rewardsVault: `0xb9F539d43C894bd335405e2430303594d014356A`,
    },
    vaultName: 'OVL Vault',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.BGT,
        rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
      }
    ]
  },
  {
    vaultAddress: {
      poolVault: `0x20a49a266ae70d07ba066ef1f8b6e670216ab2a6`,
      rewardsVault: `0xb9F539d43C894bd335405e2430303594d014356A`,
    },
    vaultName: 'BERA Vault',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.BGT,
        rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
      }
    ]
  },
  {
    vaultAddress: {
      poolVault: `0x2c6be3eaa0b4fb479b031ac58b1c4c338d5c908b`,
      rewardsVault: `0xb9F539d43C894bd335405e2430303594d014356A`,
    },
    vaultName: 'BERA Vault',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.BGT,
        rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
      }
    ]
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