import { useVaultsDetails } from "../../pages/Earn/hooks/useVaultsDetails";
import { useVaults } from "../../pages/Earn/hooks/useVaults";
import { useVaultsState } from "../../state/vaults/hooks";
import { VaultsContext } from "./types";

const VaultsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // useVaults();
  useVaultsDetails();

  const { vaultsDetails } = useVaultsState();

  const contextValue = {
    // vaults,
    vaultsDetails,
  };

  return (
    <VaultsContext.Provider value={contextValue}>
      {children}
    </VaultsContext.Provider>
  );
};

export default VaultsProvider;
