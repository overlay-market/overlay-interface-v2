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
  const { fetchedVaultsData } =
    useFetchVaultsData();


  const [vaultsDetails, setVaultsDetails] = useState<CalculatedVaultData[]>([]);

  useEffect(() => {
    const calculateVaults = async () => {
      if (!fetchedVaultsData.length || pricesLoading || pricesError) return;

      let calculatedVaults: PartialVault[] = initializeVaults(fetchedVaultsData);
           
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