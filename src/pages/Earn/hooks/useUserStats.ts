import { useEffect, useState } from "react";
import steerClient from "../../../services/steerClient";
import useAccount from "../../../hooks/useAccount";
import { UserStats } from "../../../types/vaultTypes";
import { formatUnits } from "viem";
import { useParams } from "react-router-dom";
import { getVaultAddressByVaultName } from "../utils/currentVaultdata";
import { useVaultsActionHandlers } from "../../../state/vaults/hooks";

export const useUserStats = () => {
  const { vaultId } = useParams();

  const stakingClient = steerClient.staking;
  const { address: userAddress } = useAccount();
  const vaultAddress = getVaultAddressByVaultName(vaultId);
  const [userStats, setUserStats] = useState<UserStats | undefined>(undefined);
  const { handleUserStatsUpdate } =
    useVaultsActionHandlers();

  useEffect(() => {
    const fetchUserStats = async () => { 
      if (!userAddress) return undefined;

      try {
        const currentBalanceResponse = await stakingClient.balanceOf(vaultAddress as `0x${string}`, userAddress);
       
        let formattedCurrentbalance = 0;

        if (currentBalanceResponse?.success && currentBalanceResponse.data) {
          formattedCurrentbalance = parseFloat(Number(
            formatUnits(currentBalanceResponse.data ?? 0n, 18)
          ).toFixed(2))
        } else {
          formattedCurrentbalance = 0;
        }  

        setUserStats({
          currentBalance: formattedCurrentbalance,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }  
    };

    fetchUserStats();
  }, [userAddress]);

  useEffect(() => {
    if (userStats) {
      handleUserStatsUpdate(userStats);
    }
  }, [userStats]);
};
