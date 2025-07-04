import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import USDCToken from "../assets/images/token-logos/USDC-token.webp";
import BGTToken from "../assets/images/token-logos/BGT-token.webp";
import { StaticVaultData, VaultItem } from "../types/vaultTypes";
import { Address } from "viem";

export enum TOKENS {
  USDC = 'USDC', 
  OVL = 'OVL',
  BNB = 'BNB',
  BGT = 'BGT',
  ICHI = 'LP_ICHI',
  yBGT = 'yBGT'
}

export const TOKEN_LOGOS: Partial<{ [key in TOKENS]: string }> = {
  [TOKENS.USDC]: USDCToken,
  [TOKENS.OVL]: OVLToken,
  [TOKENS.BNB]: OVLToken,
  [TOKENS.BGT]: BGTToken,
  [TOKENS.yBGT]: BGTToken,
}

export const DEFAULT_TOKEN_LOGO = OVLToken

export const BERA_VAULTS_SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/88584/berachain-v2-kodiak/version/latest'

export const VOLATILITY_THRESHOLD = 100;
export const VOLATILITY_CHECK_ADDRESS = '0x2454e75749322d59278Bca48cBD96DD62274359b';

// export const ICHIVaultDepositGuard: {
//   depositGuardAddress: Address;
//   vaultDeployerAddress: Address;
// } = {
//   depositGuardAddress: `0x2174154294729e593001CBF0232fb787a914b232`,
//   vaultDeployerAddress: `0x05cC3CA6E768a68A7f86b09e3ceE754437bd5f12`,
// }

export const ICHIVaultDepositGuard: {
  depositGuardAddress: Address;
  vaultDeployerAddress: Address;
} = {
  depositGuardAddress: `0xc0c6D4178410849eC9765B4267A73F4F64241832`,
  vaultDeployerAddress: `0x9Fbba6c87923af2561A2391198166b51Cf5736E8`,
}

export const ERC4626HelperContract = `0xD36e0A4Ae7258Dd1FfE0D7f9f851461369a1AA0E`;

export enum VaultItemType {
  ICHI = 'ICHI',
  MR_SINGLE = 'MultiRewardSingle',
  MR_DUAL = 'MultiRewardDual',
  ERC4626 = 'ERC4626',
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
 // {
  //   id: 1,
  //   vaultType: VaultItemType.ICHI,
  //   vaultAddress: '0xeB184FD678854dE991FFF9a715A42eB933b9170E',
  //   rewardTokens: [
  //     {
  //       rewardTokenName: TOKENS.ICHI,
  //       rewardTokenAddress: `0xeB184FD678854dE991FFF9a715A42eB933b9170E`,
  //     }
  //   ]
  // },
  // {
  //   id: 2,
  //   vaultType: VaultItemType.MR_SINGLE,
  //   vaultAddress: '0xb9F539d43C894bd335405e2430303594d014356A',
  //   rewardTokens: [
  //     {
  //       rewardTokenName: TOKENS.OVL,
  //       rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
  //     }
  //   ]
  // },
  // {
  //   id: 3,
  //   vaultType: VaultItemType.MR_SINGLE,
  //   vaultAddress: '0xb9F539d43C894bd335405e2430303594d014356A',
  //   rewardTokens: [
  //     {
  //       rewardTokenName: TOKENS.BNB,
  //       rewardTokenAddress: `0x6969696969696969696969696969696969696969`,
  //     }
  //   ]
  // },
  // {
  //   id: 4,
  //   vaultType: VaultItemType.ICHI,
  //   vaultAddress: '0xdf097f374107bfa24f8ab6011fb1b8c599b70bf7',
  //   rewardTokens: [
  //     {
  //       rewardTokenName: TOKENS.ICHI,
  //       rewardTokenAddress: `0xdf097f374107bfa24f8ab6011fb1b8c599b70bf7`,
  //     }
  //   ]
  // },
]
     
export const VAULTS: StaticVaultData[] = [
  // {
  //   id: 1,
  //   vaultName: 'OVL Vault',
  //   combinationType: [VaultItemType.ICHI, VaultItemType.MR_SINGLE],
  //   vaultItems: [4, 2]   
  // },
  // {
  //   id: 2,
  //   vaultName: 'BNB Vault',
  //   combinationType: [VaultItemType.ICHI, VaultItemType.MR_SINGLE],
  //   vaultItems: [1, 3]   
  // },
  {
    id: 3,
    vaultName: 'BERA-OVL Vault',
    combinationType: [VaultItemType.ICHI, VaultItemType.MR_DUAL],
    vaultItems: [1, 2]   
  },
]

export const vaultsById = Object.fromEntries(VAULTS.map(v => [v.id, v]));
export const vaultItemsById = Object.fromEntries(VAULT_ITEMS.map(v => [v.id, v]));