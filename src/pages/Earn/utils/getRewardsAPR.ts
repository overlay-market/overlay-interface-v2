import { PublicClient } from "viem";
import { PriceItem } from "../hooks/useTokenPrices";
import { VaultItemType, vaultsById } from "../../../constants/vaults";
import { getRewardsAPRForMRType } from "./getRewardsAPRForMRType";
import { getRewardsAPRForERC4626 } from "./getRewardsAPRForERC4626";
import { MR_types } from "../../../types/vaultTypes";

export const getRewardsAPR = async (
  vaultId: number,
  prices: PriceItem[],
  publicClient: PublicClient
): Promise<number | null> => {
  const currentVault = vaultsById[vaultId];
  
  const hasMRType = currentVault.combinationType.some(type =>
    MR_types.includes(type))
    
  if (hasMRType) {
    return getRewardsAPRForMRType(vaultId, prices, publicClient);
  }

  const hasERC4626 = currentVault.combinationType.includes(VaultItemType.ERC4626);
  if (hasERC4626) {
    return getRewardsAPRForERC4626(vaultId, publicClient);
  }

  console.error(`No supported vault type found for vault ${vaultId}`);
  return null;
};