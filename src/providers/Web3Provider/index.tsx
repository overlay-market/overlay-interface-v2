import { wagmiConfig } from "./wagmi";
import { PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectionProvider from "../ConnectionProvider";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { arbitrumSepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;

const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();

  createWeb3Modal({
    wagmiConfig,
    projectId,
    defaultChain: arbitrumSepolia,
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider>{children}</ConnectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
