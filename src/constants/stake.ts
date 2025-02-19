import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import USDCToken from "../assets/images/token-logos/USDC-token.webp";
import BGTToken from "../assets/images/token-logos/BGT-token.webp";
import { SUPPORTED_CHAINID } from "./chains";

export enum VAULTS_NAMES {
  USDC_OVL = 'USDC-OVL', 
  OVL = 'OVL',
  BERA_OVL = 'BERA-OVL',
}

export const VAULTS_TOKEN_LOGOS: { [key in VAULTS_NAMES]: string[]; } = {
  [VAULTS_NAMES.USDC_OVL]: [
    USDCToken,
    OVLToken,
  ],
  [VAULTS_NAMES.OVL]: [
    OVLToken,
  ],
  [VAULTS_NAMES.BERA_OVL]: [
    BGTToken,
    OVLToken,
  ],
}

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

export interface VaultData {
  vaultName: string
  vaultAddress: string
}

export type VaultsMap = {
  [key: number ]: VaultData[];
};

export const ACTIVE_VAULTS: VaultsMap = {
  [SUPPORTED_CHAINID.BARTIO]: [
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
  ], 
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: [
    {
      vaultName: 'USDC-OVL',
      vaultAddress: '0xd6F05636E91Ed40419C1fB8F024FBeef2cD4cd8f',
    },
    {
      vaultName: 'BERA-OVL',
      vaultAddress: '0xA8047Ce9C3c8Ec156F0d4Cac4f860b97819d8243',
    },
  ], 
}