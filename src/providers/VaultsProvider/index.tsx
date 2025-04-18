import { useVaultsDetails } from "../../pages/Earn/hooks/useVaultsDetails";
import { useVaultsState } from "../../state/vaults/hooks";
import { VaultsContext } from "./types";

const VaultsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useVaultsDetails();

  const { vaultsDetails } = useVaultsState();

  const contextValue = {
    vaultsDetails,
  };

  return (
    <VaultsContext.Provider value={contextValue}>
      {children}
    </VaultsContext.Provider>
  );
};

export default VaultsProvider;
