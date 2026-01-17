import { createContext } from "react";

export type MiniAppSdkContextValue = {
  isWebViewEnvironment: boolean;
  walletAddress?: `0x${string}`;
  isAuthenticating: boolean;
  error?: string;
  authenticate: () => Promise<void>;
};

export const MiniAppSdkContext = createContext<MiniAppSdkContextValue>({
  isWebViewEnvironment: false,
  walletAddress: undefined,
  isAuthenticating: false,
  error: undefined,
  authenticate: async () => {
    // default noop to keep context consumers safe outside of provider
  },
});
