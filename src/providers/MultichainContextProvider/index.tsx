import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { MultichainContext } from "./types";
import useAccount from "../../hooks/useAccount";

const MultichainContextProvider: React.FC<
  PropsWithChildren<{
    initialChainId?: number;
  }>
> = ({ children, initialChainId }) => {
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    initialChainId
  );

  const account = useAccount();

  useEffect(() => {
    if (initialChainId) {
      setSelectedChainId(initialChainId);
    }
  }, [initialChainId, setSelectedChainId]);

  const value = useMemo(() => {
    return {
      setSelectedChainId,
      initialChainId,
      chainId: selectedChainId ?? account.chainId ?? DEFAULT_CHAINID,
      isMultichainContext: true,
    };
  }, [initialChainId, account.chainId, selectedChainId]);

  return (
    <MultichainContext.Provider value={value}>
      {children}
    </MultichainContext.Provider>
  );
};

export default MultichainContextProvider;
