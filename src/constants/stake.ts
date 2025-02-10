import OVLToken from "../assets/images/token-logos/OVL-token.webp";
import USDCToken from "../assets/images/token-logos/USDC-token.webp";
import BGTToken from "../assets/images/token-logos/BGT-token.webp";

export enum VAULTS {
  USDC_OVL = 'USDC-OVL', 
  OVL = 'OVL',
  BERA_OVL = 'BERA-OVL',
}

export const VAULTS_TOKEN_LOGOS: { [key in VAULTS]: string[]; } = {
  [VAULTS.USDC_OVL]: [
    USDCToken,
    OVLToken,
  ],
  [VAULTS.OVL]: [
    OVLToken,
  ],
  [VAULTS.BERA_OVL]: [
    BGTToken,
    OVLToken,
  ],
}