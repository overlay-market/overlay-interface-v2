import {  PartialVault } from '../../../types/vaultTypes';

export const calculateTotalAPR = ({
  vault
}: {
  vault: PartialVault;
}): void => {
  if (vault.poolApr && vault.rewardsApr) {
    vault.totalApr = (Number(vault.poolApr) + Number(vault.rewardsApr)).toString()
  }  
}