import { ACTIVE_VAULTS_STEER } from "../../../constants/vaults";

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
