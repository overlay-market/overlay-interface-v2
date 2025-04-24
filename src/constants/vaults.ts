import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import USDCToken from "../assets/images/token-logos/USDC-token.webp";
import BGTToken from "../assets/images/token-logos/BGT-token.webp";
import { StaticVaultData, VaultItem } from "../types/vaultTypes";

export enum TOKENS {
  USDC = 'USDC', 
  OVL = 'OVL',
  BGT = 'BGT',
  ICHI = 'LP_ICHI',
}

export const TOKEN_LOGOS: Partial<{ [key in TOKENS]: string }> = {
  [TOKENS.USDC]: USDCToken,
  [TOKENS.OVL]: OVLToken,
  [TOKENS.BGT]: BGTToken,
}

export const DEFAULT_TOKEN_LOGO = BGTToken

export const BERA_VAULTS_SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/88584/berachain-v2-kodiak/version/latest'

export enum VaultItemType {
  ICHI = 'ICHI',
  MR_SINGLE = 'MultiRewardSingle',
  MR_DUAL = 'MultiRewardDual',
}

export const VAULT_ITEMS: VaultItem[] = [
  {
    id: 1,
    vaultType: VaultItemType.ICHI,
    vaultAddress: '0x04fD6a7B02E2e48caedaD7135420604de5f834f8',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.ICHI,
        rewardTokenAddress: `0x04fD6a7B02E2e48caedaD7135420604de5f834f8`,
      }
    ]
  },
  {
    id: 2,
    vaultType: VaultItemType.MR_SINGLE,
    vaultAddress: '0xb9F539d43C894bd335405e2430303594d014356A',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.BGT,
        rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
      }
    ]
  },
  {
    id: 3,
    vaultType: VaultItemType.ICHI,
    vaultAddress: '0x3efF586Be3a907D8dEC40178eb35215215F58Af7',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.ICHI,
        rewardTokenAddress: `0x3efF586Be3a907D8dEC40178eb35215215F58Af7`,
      }
    ]
  },
  {
    id: 4,
    vaultType: VaultItemType.ICHI,
    vaultAddress: '0x2c6be3eaa0b4fb479b031ac58b1c4c338d5c908b',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.ICHI,
        rewardTokenAddress: `0x2c6be3eaa0b4fb479b031ac58b1c4c338d5c908b`,
      }
    ]
  },
  {
    id: 5,
    vaultType: VaultItemType.MR_DUAL,
    vaultAddress: '0xb9F539d43C894bd335405e2430303594d014356A',
    rewardTokens: [
      {
        rewardTokenName: TOKENS.BGT,
        rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
      },
      {
        rewardTokenName: TOKENS.OVL,
        rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
      }
    ]
  },
]
     
export const VAULTS: StaticVaultData[] = [
  {
    id: 1,
    vaultName: 'OVL Vault',
    combinationType: [VaultItemType.ICHI, VaultItemType.MR_SINGLE],
    vaultItems: [1, 2]   
  },
  {
    id: 2,
    vaultName: 'BERA Vault',
    combinationType: [VaultItemType.ICHI, VaultItemType.MR_SINGLE],
    vaultItems: [3, 2]   
  },
  {
    id: 3,
    vaultName: 'BERA-OVL Vault',
    combinationType: [VaultItemType.ICHI, VaultItemType.MR_DUAL],
    vaultItems: [4, 5]   
  },
]

export const vaultsById = Object.fromEntries(VAULTS.map(v => [v.id, v]));
export const vaultItemsById = Object.fromEntries(VAULT_ITEMS.map(v => [v.id, v]));