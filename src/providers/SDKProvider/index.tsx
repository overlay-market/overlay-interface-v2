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
        [SUPPORTED_CHAINID.BARTIO]: import.meta.env.VITE_BARTIO_RPC,
        [SUPPORTED_CHAINID.BERACHAIN]: "https://rpc.berachain.com",
        [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]: import.meta.env
          .VITE_ARBITRUM_SEPOLIA_RPC,
        [SUPPORTED_CHAINID.BSC_TESTNET]: import.meta.env.VITE_BSC_TESTNET_RPC,
      },
      web3Provider: walletClient as any,
    });
  }, [chainId, walletClient]);

  console.log("SDK instance created with chainId:", chainId);

  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export default SDKProvider;
