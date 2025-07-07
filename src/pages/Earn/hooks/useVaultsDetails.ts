import { useEffect, useMemo, useState } from "react";
import { CalculatedVaultData } from "../../../types/vaultTypes";
import { useVaultsActionHandlers } from "../../../state/vaults/hooks";
import { isCompleteVault } from "../utils/isCompleteVault";
import { VaultItemType, VAULTS } from "../../../constants/vaults";
import { useVaultsDetailsWithIchi } from "./useVaultsDetailsWithIchi";

export const useVaultsDetails = () => {
  const { handleVaultDetailsUpdate } =
    useVaultsActionHandlers();

  const vaultsWithIchiIds = useMemo(() => {
    return VAULTS
    .filter(vault => vault.combinationType.includes(VaultItemType.ICHI))
    .map(vault => vault.id)
  }, [VAULTS]);  

  // const vaultsWithOnlyMR = VAULTS.filter(vault =>
  //   vault.combinationType.every(type => MR_types.includes(type))
  // );
  
  const  vaultDetailsWithIchi = useVaultsDetailsWithIchi(vaultsWithIchiIds);
  

  const [vaultsDetails, setVaultsDetails] = useState<CalculatedVaultData[]>([]);
  useEffect(() => {
    const calculateVaults = async () => {
      if (vaultDetailsWithIchi.length === 0 ) return;

      const calculatedVaults = [
        ...vaultDetailsWithIchi,
      ];
      
      const completeVaults = calculatedVaults.filter((vault): vault is CalculatedVaultData =>
        isCompleteVault(vault)
      );
      setVaultsDetails(completeVaults);
    };
    
    calculateVaults();
  }, [vaultDetailsWithIchi]);

  useEffect(() => {
    if (vaultsDetails) {
      handleVaultDetailsUpdate(vaultsDetails);
    }
  }, [vaultsDetails, handleVaultDetailsUpdate]);
};