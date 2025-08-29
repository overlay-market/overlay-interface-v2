import React, { createContext, useEffect, useRef, useState } from "react";
import { createConfig, EVM, config as lifiConfig, SDKConfig } from "@lifi/sdk";
import { useConfig, useWalletClient } from "wagmi";
import { WalletClient } from "viem";

interface LiFiProviderProps {
  children: React.ReactNode;
  sdkConfig?: SDKConfig;
}

export const LiFiContext = createContext<typeof lifiConfig | null>(null);

export const LiFiProvider = ({ children, sdkConfig }: LiFiProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: walletClient, refetch: refetchWalletClient } =
    useWalletClient();
  const config = useConfig();

  const walletClientRef: React.MutableRefObject<WalletClient | null> =
    useRef(null);

  useEffect(() => {
    const updateWalletClient = async () => {
      const { data: updatedWalletClient } = await refetchWalletClient();
      walletClientRef.current = updatedWalletClient ?? null;
    };

    updateWalletClient();
  }, [walletClient, config.state.chainId, refetchWalletClient]);

  useEffect(() => {
    if (isInitialized) return;

    createConfig({
      integrator: "overlay",
      providers: [
        EVM({
          getWalletClient: async () => {
            const client = walletClientRef.current;
            if (!client) throw new Error("No wallet client available");

            return client;
          },
        }),
      ],
      ...sdkConfig,
    });

    setIsInitialized(true);
  }, [sdkConfig, isInitialized]);

  return (
    <LiFiContext.Provider value={lifiConfig}>{children}</LiFiContext.Provider>
  );
};