import { Reward } from "@steerprotocol/sdk";
import { ACTIVE_VAULTS_STEER, DEFAULT_TOKEN_LOGO, TOKEN_LOGOS, TOKENS } from "../../../constants/vaults";

export const getVaultNameByVaultAddress = ( vaultAddress: string) => {
  return (
    ACTIVE_VAULTS_STEER.find(
      (v) => v.vaultAddress.toLowerCase() === vaultAddress
    )?.vaultName || ""
  )
}  

export const getVaultAddressByVaultName = ( vaultName: string | undefined) => {
  return (
    ACTIVE_VAULTS_STEER.find(
      (v) => v.vaultName === vaultName
    )?.vaultAddress || ""
  )
}

export const getTokenLogo = (tokenDetail: Reward) => {
  return TOKEN_LOGOS[tokenDetail.symbol as TOKENS] || DEFAULT_TOKEN_LOGO;
};