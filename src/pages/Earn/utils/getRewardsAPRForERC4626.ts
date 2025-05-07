import { formatUnits, getContract, PublicClient } from "viem";
import { ERC4626HelperContract } from "../../../constants/vaults";
import { ERC4626HelperContractABI } from "../abi/ERC4626HelperContractABI";
import { getTokenDecimals } from "./getTokenDecimals";
import { getERC4626VaultItemByVaultId } from "./getVaultItem";

export const getRewardsAPRForERC4626 = async (
  vaultId: number,
  publicClient: PublicClient
): Promise<number | null> => {
  try {
    const currentERC4626Vault = getERC4626VaultItemByVaultId(vaultId);

    if (!currentERC4626Vault) return null;

    const currentERC4626VaultAddress = currentERC4626Vault.vaultAddress;

    const contract = getContract({
      address: ERC4626HelperContract,
      abi: ERC4626HelperContractABI,
      client: publicClient,
    });

    const rawApr = await contract.read.getApr([
      currentERC4626VaultAddress
    ]) as bigint;

    const decimals = await getTokenDecimals(currentERC4626Vault.rewardTokens[0].rewardTokenAddress, publicClient);
    const apr = Number(formatUnits(rawApr, decimals));

    return apr;
  } catch (error) {
    console.error(`Error calculating APR for ERC4626 vault ${vaultId}:`, error);
    return null;
  }
};