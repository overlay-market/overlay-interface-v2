import { StakingPool } from "@steerprotocol/sdk";
import { useEffect, useRef, useState } from "react";
import steerClient from "../../../services/steerClient";
import useAccount from "../../../hooks/useAccount";
import { VaultDetails } from "../../../types/vaultTypes";
import { formatUnits } from "viem";

export const useVaultDetails = (vaults?: StakingPool[]) => {
  const stakingClient = steerClient.staking;
  const { address: userAddress } = useAccount();
  const [vaultsDetails, setVaultsDetails] = useState<VaultDetails[]>([]);
  const totalSupplyCache = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const fetchVaultsDetails = async () => {
      if (!vaults) return;

      const newVaultsData: VaultDetails[] = await Promise.all(
        vaults.map(async (vault) => {
          try {
            let formattedTotalSupply = totalSupplyCache.current.get(
              vault.stakingPool
            );

            const totalSupplyPromise =
              formattedTotalSupply !== undefined
                ? Promise.resolve(formattedTotalSupply)
                : stakingClient.totalSupply(vault.stakingPool as `0x${string}`);

            const rewardsPromise = userAddress
              ? stakingClient.earned(
                  vault.stakingPool as `0x${string}`,
                  userAddress
                )
              : Promise.resolve(undefined);

            const [totalSupplyResponse, rewardsResponse] = await Promise.all([
              totalSupplyPromise,
              rewardsPromise,
            ]);

            if (typeof totalSupplyResponse !== "number") {
              if (totalSupplyResponse?.success && totalSupplyResponse.data) {
                formattedTotalSupply = Math.trunc(
                  Number(formatUnits(totalSupplyResponse.data, 18))
                );
                
                totalSupplyCache.current.set(
                  vault.stakingPool,
                  formattedTotalSupply
                );
              } else {
                formattedTotalSupply = 0;
              }
            }

            let userRewards: VaultDetails["userRewards"] = undefined;

            if (
              rewardsResponse &&
              rewardsResponse.success &&
              rewardsResponse.data
            ) {
              userRewards = {
                rewardA: parseFloat(Number(
                  formatUnits(rewardsResponse.data.rewardA ?? 0n, 18)
                ).toFixed(2)),
                rewardB:
                  "rewardB" in rewardsResponse.data
                    ? parseFloat(Number(formatUnits(rewardsResponse.data.rewardB ?? 0n, 18)).toFixed(2))
                    : undefined,
              };
            } else if (userAddress) {
              console.error(
                "Error fetching rewards:",
                rewardsResponse?.error
              );
            }

            return {
              vaultAddress: vault.stakingPool,
              totalSupply: formattedTotalSupply ?? 0,
              userRewards,
            };
          } catch (err) {
            console.error(
              `Error fetching details for vault ${vault.stakingPool}:`,
              err
            );
            return {
              vaultAddress: vault.stakingPool,
              totalSupply: 0,
              userRewards: undefined,
            };
          }
        })
      );

      setVaultsDetails(newVaultsData);
    };

    fetchVaultsDetails();
  }, [vaults, userAddress]);

  return vaultsDetails;
};
