// context/SDKContext.tsx
import React, { useMemo } from "react";
import { OverlaySDK } from "overlay-sdk";
import { createPublicClient, http, Chain } from "viem";
import { useConnectorClient } from "wagmi";
import { DEFAULT_CHAINID, VIEM_CHAINS } from "../../constants/chains";
import useMultichainContext from "../MultichainContextProvider/useMultichainContext";
import { SDKContext } from "./types";

const SDKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId } = useMultichainContext();
  const { data: walletClient } = useConnectorClient();

  const sdk = useMemo(() => {
    const rpcProvider = createPublicClient({
      chain: VIEM_CHAINS[chainId as keyof typeof VIEM_CHAINS ?? DEFAULT_CHAINID as keyof typeof VIEM_CHAINS] as Chain,
      transport: http(),
    });

    return new OverlaySDK({
      chainId: chainId ? chainId as number : DEFAULT_CHAINID as number,
      rpcProvider,
      web3Provider: walletClient as any,
    });
  }, [chainId, walletClient]);

  console.log("SDK instance created with chainId:", chainId);

  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export default SDKProvider;