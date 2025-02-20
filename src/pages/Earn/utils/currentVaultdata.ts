import { Reward } from "@steerprotocol/sdk";
import { ACTIVE_VAULTS, DEFAULT_TOKEN_LOGO, TOKEN_LOGOS, TOKENS } from "../../../constants/stake";
import { Chain } from "viem";

export const getVaultNameByVaultAddress = (chainId: number | Chain | undefined, vaultAddress: string) => {
  return (
    ACTIVE_VAULTS[chainId as number]?.find(
      (v) => v.vaultAddress.toLowerCase() === vaultAddress
    )?.vaultName || ""
  )
}  

export const getVaultAddressByVaultName = (chainId: number | Chain | undefined, vaultName: string | undefined) => {
  return (
    ACTIVE_VAULTS[chainId as number]?.find(
      (v) => v.vaultName === vaultName
    )?.vaultAddress || ""
  )
}

export const getTokenLogo = (tokenDetail: Reward) => {
  return TOKEN_LOGOS[tokenDetail.symbol as TOKENS] || DEFAULT_TOKEN_LOGO;
};