import React, { useMemo } from "react";
import { OverlaySDK } from "overlay-sdk";
import { useConnectorClient } from "wagmi";
import { SUPPORTED_CHAINID } from "../../constants/chains";
import { SDKContext } from "./types";

const SDKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: walletClient } = useConnectorClient();

  const sdk = useMemo(() => {
    return new OverlaySDK({
      chainId: SUPPORTED_CHAINID.BERACHAIN as number,
      rpcUrls: {
        [SUPPORTED_CHAINID.BERACHAIN]: import.meta.env.VITE_BERACHAIN_RPC,
      },
      web3Provider: walletClient as any,
      useShiva: true,
      brokerId: import.meta.env.VITE_BROKER_ID,
    });
  }, [walletClient]);

  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export default SDKProvider;
