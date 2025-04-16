import { useEffect, useState } from "react";
import steerClient from "../../../services/steerClient";
import { StakingPool } from "@steerprotocol/sdk";
import { ACTIVE_VAULTS_STEER } from "../../../constants/vaults";
import { useVaultsActionHandlers } from "../../../state/vaults/hooks";


export const useVaults = () => {
  const stakingClient = steerClient.staking;
  const { handleVaultsUpdate } =
    useVaultsActionHandlers();

  const [vaults, setVaults] = useState<StakingPool[] | undefined>(undefined);

  useEffect(() => {
    const fetchActiveVaults = async () => {
     

      try {
        // const activeVaults = await stakingClient.getLiveStakingPools();
        const activeVaults = await stakingClient.getStakingPools();

        // const activeVaults = await stakingClient.getLiveStakingPools(chainId);
        if (!activeVaults.success) {
          console.error("Error fetching vaults:", activeVaults.error);
          return;
        }

        const filteredVaults: StakingPool[] =
          activeVaults.data?.filter((pool) =>
          ACTIVE_VAULTS_STEER.some((vault) => vault.vaultAddress === pool.stakingPool)
          ) || [];

        setVaults(filteredVaults);
      } catch (error) {
        console.error("Error fetching vaults:", error);
      }
    };

    fetchActiveVaults();
  }, []);

  useEffect(() => {
    if (vaults) {
      handleVaultsUpdate(vaults);
    }
  }, [vaults]);
};