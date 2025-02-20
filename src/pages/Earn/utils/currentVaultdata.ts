import { Reward } from "@steerprotocol/sdk";
import { ACTIVE_VAULTS, DEFAULT_TOKEN_LOGO, TOKEN_LOGOS, TOKENS } from "../../../constants/stake";

export const getVaultNameByVaultAddress = ( vaultAddress: string) => {
  return (
    ACTIVE_VAULTS.find(
      (v) => v.vaultAddress.toLowerCase() === vaultAddress
    )?.vaultName || ""
  )
}  

export const getVaultAddressByVaultName = ( vaultName: string | undefined) => {
  return (
    ACTIVE_VAULTS.find(
      (v) => v.vaultName === vaultName
    )?.vaultAddress || ""
  )
}

export const getTokenLogo = (tokenDetail: Reward) => {
  return TOKEN_LOGOS[tokenDetail.symbol as TOKENS] || DEFAULT_TOKEN_LOGO;
};