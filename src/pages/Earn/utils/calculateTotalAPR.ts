import {  PartialVault } from '../../../types/vaultTypes';

export const calculateTotalAPR = (vault: PartialVault): number | null => {
  const ichi = parseFloat(vault.ichiApr ?? '0');
  const multi = parseFloat(vault.multiRewardApr ?? '0');

  const total = ichi + multi; 

  if (!isNaN(total)) {
    return total
  } else {
    return null
  }
}