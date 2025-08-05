import React, { createContext, useEffect, useState } from "react";
import { createConfig, EVM, config as lifiConfig, SDKConfig } from "@lifi/sdk";
import { useWalletClient } from "wagmi";
import { createWalletClient, custom } from "viem";

interface LiFiProviderProps {
  children: React.ReactNode;
  sdkConfig?: SDKConfig;
}

export const LiFiContext = createContext<typeof lifiConfig | null>(null);

export const LiFiProvider = ({ children, sdkConfig }: LiFiProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!walletClient) return;

    const client = createWalletClient({
      account: walletClient.account,
      chain: walletClient.chain,
      transport: custom(walletClient.transport),
    });

    createConfig({
      integrator: "overlay",
      providers: [
        EVM({
          getWalletClient: async () => client,
        }),
      ],
      ...sdkConfig,
    });

    setIsInitialized(true);
  }, [sdkConfig, walletClient]);

  if (!isInitialized) return null;

  return (
    <LiFiContext.Provider value={lifiConfig}>{children}</LiFiContext.Provider>
  );
};
