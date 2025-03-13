import { useEffect, useState } from "react";
import steerClient from "../../../services/steerClient";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { StakingPool } from "@steerprotocol/sdk";
import { ACTIVE_VAULTS } from "../../../constants/stake";
import { useVaultsActionHandlers } from "../../../state/vaults/hooks";


export const useVaults = () => {
  const stakingClient = steerClient.staking;
  const { chainId } = useMultichainContext();
  const { handleVaultsUpdate } =
    useVaultsActionHandlers();

  const [vaults, setVaults] = useState<StakingPool[] | undefined>(undefined);

  useEffect(() => {
    const fetchActiveVaults = async () => {
      if (!chainId) return;

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
          ACTIVE_VAULTS.some((vault) => vault.vaultAddress === pool.stakingPool)
          ) || [];

        setVaults(filteredVaults);
      } catch (error) {
        console.error("Error fetching vaults:", error);
      }
    };

    fetchActiveVaults();
  }, [chainId]);

  useEffect(() => {
    if (vaults) {
      handleVaultsUpdate(vaults);
    }
  }, [chainId, vaults]);
};