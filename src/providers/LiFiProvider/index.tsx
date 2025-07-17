import React, { createContext, useEffect, useState } from "react";
import { createConfig, config as lifiConfig, SDKConfig } from "@lifi/sdk";

interface LiFiProviderProps {
  children: React.ReactNode;
  sdkConfig?: SDKConfig;
}

export const LiFiContext = createContext<typeof lifiConfig | null>(null);

export const LiFiProvider = ({ children, sdkConfig }: LiFiProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    createConfig({
      integrator: "overlay",
      ...sdkConfig,
    });

    setIsInitialized(true);
  }, [sdkConfig]);

  if (!isInitialized) return null;

  return (
    <LiFiContext.Provider value={lifiConfig}>{children}</LiFiContext.Provider>
  );
};
