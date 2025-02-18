import { useEffect, useState } from "react";
import steerClient from "../../../services/steerClient";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { StakingPool } from "@steerprotocol/sdk";
import { ACTIVE_VAULTS } from "../../../constants/stake";


export const useVaults = () => {
  const stakingClient = steerClient.staking;
  const { chainId } = useMultichainContext();

  const [vaults, setVaults] = useState<StakingPool[] | undefined>(undefined);

  useEffect(() => {
    const fetchActiveVaults = async () => {
      if (!chainId) return;

      try {
        const activeVaults = await stakingClient.getLiveStakingPools();
        // const activeVaults = await stakingClient.getLiveStakingPools(chainId);
        if (!activeVaults.success) {
          console.error("Error fetching vaults:", activeVaults.error);
          return;
        }

        const chainVaults = ACTIVE_VAULTS[chainId as number] || [];
        const filteredVaults: StakingPool[] =
          activeVaults.data?.filter((pool) =>
            chainVaults.some((vault) => vault.vaultAddress === pool.stakingPool)
          ) || [];

        setVaults(filteredVaults);
      } catch (error) {
        console.error("Error fetching vaults:", error);
      }
    };

    fetchActiveVaults();
  }, [chainId]);

  return vaults;
};