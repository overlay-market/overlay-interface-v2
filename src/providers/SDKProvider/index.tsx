// context/SDKContext.tsx
import React, { useMemo } from "react";
import { OverlaySDK } from "overlay-sdk";
import { useConnectorClient } from "wagmi";
import { DEFAULT_CHAINID, SUPPORTED_CHAINID } from "../../constants/chains";
import useMultichainContext from "../MultichainContextProvider/useMultichainContext";
import { SDKContext } from "./types";

const SDKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId } = useMultichainContext();
  const { data: walletClient } = useConnectorClient();

  const sdk = useMemo(() => {
    return new OverlaySDK({
      chainId: chainId ? (chainId as number) : (DEFAULT_CHAINID as number),
      rpcUrls: {
        [SUPPORTED_CHAINID.BEPOLIA]: import.meta.env.VITE_BEPOLIA_RPC,
        [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: import.meta.env
          .VITE_ARBITRUM_SEPOLIA_RPC,
      },
      web3Provider: walletClient as any,
      useShiva: true,
    });
  }, [chainId, walletClient]);

  console.log("SDK instance created with chainId:", chainId);

  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export default SDKProvider;
