import { useVaultDetails } from "../../pages/Earn/hooks/useVaultDetails";
import { useVaults } from "../../pages/Earn/hooks/useVaults";
import { useVaultsState } from "../../state/vaults/hooks";
import { SteerContext } from "./types";

const SteerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useVaults();
  useVaultDetails();

  const { vaults, vaultDetails } = useVaultsState();

  const contextValue = {
    vaults,
    vaultDetails,
  };

  return (
    <SteerContext.Provider value={contextValue}>
      {children}
    </SteerContext.Provider>
  );
};

export default SteerProvider;
