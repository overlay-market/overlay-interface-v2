import { useEffect, useState } from "react";
import { CalculatedVaultData, PartialVault } from "../../../types/vaultTypes";
import { useVaultsActionHandlers } from "../../../state/vaults/hooks";
import { useTokenPrices } from "./useTokenPrices";
import { initializeVaults } from "../utils/initializeVaults";
import { useFetchVaultsData } from "./useFetchVaultsData";
import { isCompleteVault } from "../utils/isCompleteVault";
import { calculateTVL } from "../utils/calculateTVL";
import { calculateRewardsAPR } from "../utils/calculateRewardsAPR";
import { calculateTotalAPR } from "../utils/calculateTotalAPR";

export const useVaultsDetails = () => {
  const { handleVaultDetailsUpdate } =
    useVaultsActionHandlers();

  const { prices, loading: pricesLoading, error: pricesError } = useTokenPrices();
  const { fetchedVaultsData, loading: vaultsLoading, error: vaultsError } =
    useFetchVaultsData();


  const [vaultsDetails, setVaultsDetails] = useState<CalculatedVaultData[]>([]);
  // const [fetchedVaultsData, setFetchedVaultsData] = useState<FetchedVaultData[]>([])
  
console.log({prices, fetchedVaultsData})

  useEffect(() => {
    const calculateVaults = async () => {
      if (!fetchedVaultsData.length || pricesLoading || pricesError) return;

      let calculatedVaults: PartialVault[] = initializeVaults(fetchedVaultsData);
      console.log({calculatedVaults})
      
      const calculationSteps = [
        (vault: PartialVault) => calculateTVL({
          vault,
          fetchedVault: fetchedVaultsData.find(fetchedVault => fetchedVault.id.toLowerCase() === vault.poolVaultAddress?.toLowerCase())!,
          prices,
        }),
        (vault: PartialVault) => calculateRewardsAPR({vault, prices}),
        (vault: PartialVault) => calculateTotalAPR({vault}),
      ];

      for (const step of calculationSteps) {
        await Promise.all(calculatedVaults.map((vault) => step(vault)));
      }
      
      console.log({calculatedVaults})
      
      const completeVaults = calculatedVaults.filter((vault): vault is CalculatedVaultData =>
        isCompleteVault(vault)
      );

      setVaultsDetails(completeVaults);
    };
    
    calculateVaults();
  }, [ fetchedVaultsData, prices, pricesLoading, pricesError]);

  useEffect(() => {
    if (vaultsDetails) {
      handleVaultDetailsUpdate(vaultsDetails);
    }
  }, [vaultsDetails]);
};

// useEffect(() => {
//   const fetchVaultsDetails = async () => {
//     if (!vaults) return;

//     const newVaultsData: VaultDetails[] = await Promise.all(
//       vaults.map(async (vault) => {
//         try {
//           let formattedTotalSupply = totalSupplyCache.current.get(
//             vault.stakingPool
//           );

//           const totalSupplyPromise =
//             formattedTotalSupply !== undefined
//               ? Promise.resolve(formattedTotalSupply)
//               : stakingClient.totalSupply(vault.stakingPool as `0x${string}`);

//           const rewardsPromise = userAddress
//             ? stakingClient.earned(
//                 vault.stakingPool as `0x${string}`,
//                 userAddress
//               )
//             : Promise.resolve(undefined);

//           const [totalSupplyResponse, rewardsResponse] = await Promise.all([
//             totalSupplyPromise,
//             rewardsPromise,
//           ]);

//           if (typeof totalSupplyResponse !== "number") {
//             if (totalSupplyResponse?.success && totalSupplyResponse.data) {
//               formattedTotalSupply = Math.trunc(
//                 Number(formatUnits(totalSupplyResponse.data, 18))
//               );
              
//               totalSupplyCache.current.set(
//                 vault.stakingPool,
//                 formattedTotalSupply
//               );
//             } else {
//               formattedTotalSupply = 0;
//             }
//           }

//           let userRewards: VaultDetails["userRewards"] = undefined;

//           if (
//             rewardsResponse &&
//             rewardsResponse.success &&
//             rewardsResponse.data
//           ) {
//             userRewards = {
//               rewardA: parseFloat(Number(
//                 formatUnits(rewardsResponse.data.rewardA ?? 0n, 18)
//               ).toFixed(2)),
//               rewardB:
//                 "rewardB" in rewardsResponse.data
//                   ? parseFloat(Number(formatUnits(rewardsResponse.data.rewardB ?? 0n, 18)).toFixed(2))
//                   : undefined,
//             };
//           } else if (userAddress) {
//             console.error(
//               "Error fetching rewards:",
//               rewardsResponse?.error
//             );
//           }

//           return {
//             vaultAddress: vault.stakingPool,
//             totalSupply: formattedTotalSupply ?? 0,
//             userRewards,
//           };
//         } catch (err) {
//           console.error(
//             `Error fetching details for vault ${vault.stakingPool}:`,
//             err
//           );
//           return {
//             vaultAddress: vault.stakingPool,
//             totalSupply: 0,
//             userRewards: undefined,
//           };
//         }
//       })
//     );

//     setVaultsDetails(newVaultsData);
//   };

//   fetchVaultsDetails();
// }, [vaults, userAddress]);