import { useContext } from "react";
import { MultichainContext } from "./types";
import useAccount from "../../hooks/useAccount";

const useMultichainContext = () => {
  const account = useAccount();
  const context = useContext(MultichainContext);

  return {
    ...context,
    chainId: context.isMultichainContext ? context.chainId : account.chainId,
  };
}

export default useMultichainContext;