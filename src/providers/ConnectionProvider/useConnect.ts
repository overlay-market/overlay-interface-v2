import { useContext } from "react";
import { ConnectionContext } from "./types";
import { UseConnectReturnType } from "wagmi";

/**
 * Wraps wagmi.useConnect in a singleton provider to provide the same connect state to all callers.
 * @see {@link https://wagmi.sh/react/api/hooks/useConnect}
 */

const useConnect = (): UseConnectReturnType => {
  const value = useContext(ConnectionContext);
  if (!value) {
    throw new Error("useConnect must be used within a ConnectionProvider");
  }
  return value;
}

export default useConnect;