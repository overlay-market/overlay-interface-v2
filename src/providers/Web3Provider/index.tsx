import { wagmiConfig } from "./wagmi";
import { PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

// Create QueryClient once outside component to prevent recreating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider 
          options={{
            disclaimer: (
              <>
                Perpetuals are not available to anyone residents of, or are located, incorporated, or having a registered agent in, the United States or a restricted territory as defined in Overlay's {" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://overlay.market/#/tos"
                >
                  Terms of Service
                </a>{" "}
                (the "TOS"). By connecting your wallet, you agree to the TOS.
              </>
            ),
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
