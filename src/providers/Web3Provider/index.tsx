import { wagmiConfig } from "./wagmi";
import { PropsWithChildren } from "react";
import {WagmiProvider} from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectionProvider from "../ConnectionProvider";
import { PrivyProvider } from "@privy-io/react-auth";
import {privyConfig} from './privyConfig';

const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <PrivyProvider appId='cm3g99g9p026e6jtjlcalrw4p' config={privyConfig}>
      <QueryClientProvider client={queryClient}>
    <WagmiProvider config={wagmiConfig}>
    <ConnectionProvider>{children}</ConnectionProvider>
    </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default Web3Provider;
