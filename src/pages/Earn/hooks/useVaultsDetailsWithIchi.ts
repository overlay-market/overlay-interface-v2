import { useEffect, useState } from "react";
import { CalculatedVaultData } from "../../../types/vaultTypes";
import {  useTokenPrices } from "./useTokenPrices";
import { initializeVaults, mapperWithIchi } from "../utils/initializeVaults";
import { useFetchIchiVaultsData } from "./useFetchIchiVaultsData";
import { isCompleteVault } from "../utils/isCompleteVault";
import { calculateTVL, tvlCalculatorWithIchi } from "../utils/calculateTVL";
import { calculateRewardsAPR } from "../utils/calculateRewardsAPR";
import { calculateTotalAPR } from "../utils/calculateTotalAPR";
import { vaultsById } from "../../../constants/vaults";

export const useVaultsDetailsWithIchi = (vaultsWithIchiIds: number[]): CalculatedVaultData[] => {
 
  const { prices, loading: pricesLoading, error: pricesError } = useTokenPrices();

  const { fetchedIchiVaultsData, loading } =
    useFetchIchiVaultsData();

  const [vaultsDetails, setVaultsDetails] = useState<CalculatedVaultData[]>([]);

  useEffect(() => {
    if (!fetchedIchiVaultsData.length || pricesLoading || pricesError) return;

    let cancelled = false;

    const calculateVaults = async () => {
      let calculatedVaults = initializeVaults(vaultsWithIchiIds, fetchedIchiVaultsData, mapperWithIchi);  

      for (const vault of calculatedVaults) {
        const fetchedVault = fetchedIchiVaultsData.find(fetched =>
          vaultsById[vault.id!].vaultItems.includes(fetched.id)
        );
        if (!fetchedVault) continue;
      
        const tvl = calculateTVL(fetchedVault, prices, tvlCalculatorWithIchi);
        vault.tvl = tvl.toString();
      
        const apr = await calculateRewardsAPR(vault.id!, prices);
        if (apr !== null) {
          vault.multiRewardApr = apr.toString();
        }
      
        const totalApr = calculateTotalAPR(vault);
        if (totalApr !== null) {
          vault.totalApr = totalApr.toString();
        }
      }
            
      const completeVaults = calculatedVaults.filter((vault): vault is CalculatedVaultData =>
        isCompleteVault(vault)
      );

      if (!cancelled) {
        setVaultsDetails(completeVaults);
      }
    };
    
    calculateVaults();

    return () => {
      cancelled = true; 
    };
  }, [fetchedIchiVaultsData, vaultsWithIchiIds, prices, pricesLoading, loading ]);

 return vaultsDetails
};