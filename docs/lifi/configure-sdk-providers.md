# Configure SDK Providers

> Seamlessly connecting every ecosystem for your needs

## Introduction to SDK Ecosystem Providers

The LI.FI SDK supports different blockchain ecosystems, allowing you to integrate with EVM and Solana networks, with more ecosystems on the way. Internally, providers act as abstractions for each ecosystem, handling crucial tasks such as address resolution,  balance checking, and transaction handling during route/quote execution.

These ecosystem providers are designed with modularity in mind and are fully tree-shakable, ensuring that they do not add unnecessary weight to your bundle if not used.

The SDK offers three providers, `EVM`, `Solana`, and `Sui`, each with similar configuration options respective to their ecosystems.

```typescript
import { EVM, Solana, Sui } from '@lifi/sdk'
```

The setup for all providers focuses on utilizing a wallet client, wallet adapter, or a similar wallet interface concept depending on the ecosystem-specific libraries and standards. This unified approach simplifies managing wallets and transactions across EVM-compatible, Solana, and Sui chains.

### Different types of wallets/accounts

To execute quotes/routes via a specific provider, that provider must be capable of signing transactions. SDK providers support signing transactions over the following types of wallets/accounts:

* **Local Accounts (e.g. private key/mnemonic wallets).**

Local accounts are wallets managed using private keys or mnemonic phrases. This setup is often used in backend services or scenarios where automated signing and transaction management are required.

* **JSON-RPC Accounts (e.g. Browser Extension Wallets, WalletConnect, etc.).**

Using JSON-RPC accounts involves connecting through a Web3 provider, e.g. `window.ethereum`, and managing the user's account within the browser or mobile context. This setup is popular among dApps UIs and is often used together with libraries like `Wagmi`, `@solana/web3.js`, or `@mysten/dapp-kit`.

These account types and interaction methods allow developers to choose the most suitable approach for integrating the SDK with their applications.

## Setup EVM Provider

The EVM provider execution logic is built based on the `Viem` library, using some of its types and terminology.

**Options available for configuring the EVM provider:**

* `getWalletClient`: A function that returns a `WalletClient` instance.

* `switchChain`: A hook for switching between different networks.

### Local Accounts

When using local accounts, developers need a predefined list of chains they plan to interact with in order to switch chains during transaction execution. These chains can be either from the `viem/chains` package or fetched from LI.FI API and adopted to viem's `Chain` type.

Here's a basic example using chains from `viem/chains`:

```typescript
import { createConfig, EVM } from '@lifi/sdk'
import type { Chain } from 'viem'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum, mainnet, optimism, polygon, scroll } from 'viem/chains'

const account = privateKeyToAccount('PRIVATE_KEY')

const chains = [arbitrum, mainnet, optimism, polygon, scroll]

const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})

createConfig({
  integrator: 'Your dApp/company name',
  providers: [
    EVM({
      getWalletClient: async () => client,
      switchChain: async (chainId) =>
        // Switch chain by creating a new wallet client
        createWalletClient({
          account,
          chain: chains.find((chain) => chain.id == chainId) as Chain,
          transport: http(),
        }),
    }),
  ],
})
```

### JSON-RPC Accounts

The best way to interact with JSON-RPC accounts and pass `WalletClient` to the `EVM` provider is to use the [Wagmi](https://wagmi.sh/) library. Developers can configure Wagmi chains either by using chains from the `viem/chains` package or fetching chains from LI.FI API and adapting them to Viem's `Chain` type.

Below is a simplified example of how to set up the EVM provider using chains from the LI.FI API in conjunction with Wagmi and React.

We provide a `useSyncWagmiConfig` hook that synchronizes fetched chains with the Wagmi configuration and updates connectors. Please note that we do not initialize the Wagmi configuration with connectors. Additionally, we set `reconnectOnMount` to `false` since the `reconnect` action will be called within `useSyncWagmiConfig` hook after the chains are synchronized with the configuration and connectors.

```typescript
import { ChainType, EVM, config, createConfig, getChains } from '@lifi/sdk';
import { useSyncWagmiConfig } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { getWalletClient, switchChain } from '@wagmi/core';
import { type FC, type PropsWithChildren } from 'react';
import { createClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import type { Config, CreateConnectorFn } from 'wagmi';
import { WagmiProvider, createConfig as createWagmiConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

// List of Wagmi connectors
const connectors: CreateConnectorFn[] = [injected()];

// Create Wagmi config with default chain and without connectors
const wagmiConfig: Config = createWagmiConfig({
  chains: [mainnet],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

// Create SDK config using Wagmi actions and configuration
createConfig({
  integrator: 'Your dApp/company name',
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId) => {
        const chain = await switchChain(wagmiConfig, { chainId });
        return getWalletClient(wagmiConfig, { chainId: chain.id });
      },
    }),
  ],
  // We disable chain preloading and will update chain configuration in runtime
  preloadChains: false,
});

export const CustomWagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  // Load EVM chains from LI.FI API using getChains action from LI.FI SDK
  const { data: chains } = useQuery({
    queryKey: ['chains'] as const,
    queryFn: async () => {
      const chains = await getChains({
        chainTypes: [ChainType.EVM],
      });
      // Update chain configuration for LI.FI SDK
      config.setChains(chains);
      return chains;
    },
  });

  // Synchronize fetched chains with Wagmi config and update connectors
  useSyncWagmiConfig(wagmiConfig, connectors, chains);

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};

```

### Update provider configuration

Additionally, providers allow for dynamic updates to its initial configuration via the `setOptions` function.

Here's an example of how to modify the initial configuration for `EVM` provider:

```typescript
import { createConfig, EVM } from '@lifi/sdk'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum, mainnet } from 'viem/chains'

const account = privateKeyToAccount('PRIVATE_KEY')

const mainnetClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})

const evmProvider = EVM({
  getWalletClient: async () => mainnetClient,
})

createConfig({
  integrator: 'Your dApp/company name',
  providers: [evmProvider],
})

const optimismClient = createWalletClient({
  account,
  chain: arbitrum,
  transport: http(),
})

evmProvider.setOptions({
  getWalletClient: async () => optimismClient,
})
```

### Support for Ethers.js and other alternatives

Developers can still use Ethers.js or any other alternative Web3 library in their project and [convert](https://viem.sh/docs/ethers-migration) `Signer`/`Provider` objects to Viem's `WalletClient` before passing it to the EVM provider configuration.

## Setup Solana Provider

The Solana provider execution logic is built based on the [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) and [@solana/wallet-adapter-base](https://github.com/anza-xyz/wallet-adapter) libraries, using some of its types and terminology.

**Options available for configuring the EVM provider:**

* `getWalletAdapter`: A function that returns a WalletAdapter instance.

### Local Wallet Adapter

Standard Solana libraries do not offer a built-in method for creating a wallet adapter directly from a private key. To address this limitation, we provide the `KeypairWalletAdapter`. This custom adapter enables users to create a wallet adapter from a private key.

It is worth noting that the `KeypairWalletAdapter` is designed specifically for backend or testing purposes and should not be used in user-facing code to prevent the risk of exposing your private key.

```typescript
import { createConfig, KeypairWalletAdapter, Solana } from '@lifi/sdk'

const walletAdapter = new KeypairWalletAdapter('PRIVATE_KEY')

createConfig({
  integrator: 'Your dApp/company name',
  providers: [
    Solana({
      getWalletAdapter: async () => walletAdapter,
    }),
  ],
})
```

### JSON-RPC Wallet Adapter

To interact with JSON-RPC accounts and pass `WalletAdapter` to the Solana provider, we recommend using the [@solana/wallet-adapter-base](https://github.com/anza-xyz/wallet-adapter) and [@solana/wallet-adapter-react](https://github.com/anza-xyz/wallet-adapter) libraries. Unlike Wagmi, Solana configuration for React does not have global configurations. Therefore, we need to use React hooks to update the SDK configuration at runtime.

Below is a simplified example of how to set up the Solana provider.

<CodeGroup>
  ```typescript SDKProviders.tsx
  import { Solana, config, createConfig } from '@lifi/sdk';
  import type { SignerWalletAdapter } from '@solana/wallet-adapter-base';
  import { useWallet } from '@solana/wallet-adapter-react';
  import { useEffect } from 'react';

  createConfig({
    integrator: 'Your dApp/company name',
  });

  export const SDKProviders = () => {
    const { wallet } = useWallet();

    useEffect(() => {
      // Configure SDK Providers
      config.setProviders([
        Solana({
          async getWalletAdapter() {
            return wallet?.adapter as SignerWalletAdapter;
          },
        }),
      ]);
    }, [wallet?.adapter]);

    return null;
  };
  ```

  ```typescript SolanaProvider.tsx
  import type { Adapter } from '@solana/wallet-adapter-base';
  import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
  import {
    ConnectionProvider,
    WalletProvider,
  } from '@solana/wallet-adapter-react';
  import { clusterApiUrl } from '@solana/web3.js';
  import { type FC, type PropsWithChildren } from 'react';
  import { SDKProviders } from './SDKProviders.js';

  const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet);
  /**
   * Wallets that implement either of these standards will be available automatically.
   *
   *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
   *     (https://github.com/solana-mobile/mobile-wallet-adapter)
   *   - Solana Wallet Standard
   *     (https://github.com/solana-labs/wallet-standard)
   *
   * If you wish to support a wallet that supports neither of those standards,
   * instantiate its legacy wallet adapter here. Common legacy adapters can be found
   * in the npm package `@solana/wallet-adapter-wallets`.
   */
  const wallets: Adapter[] = [];

  export const SVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          {/* Configure Solana SDK provider */}
          <SDKProviders />
          {children}
        </WalletProvider>
      </ConnectionProvider>
    );
  };
  ```
</CodeGroup>

## Setup Sui Provider

The Sui provider execution logic is built based on the [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit) and [@mysten/sui](https://sdk.mystenlabs.com/typescript) libraries, using some of its types and terminology.

**Options available for configuring the Sui provider:**

* `getWallet`: A function that returns a `WalletWithRequiredFeatures` instance (defined by `@mysten/wallet-standard`).

### JSON-RPC Wallet

To interact with user wallets (like Sui Wallet, Ethos, etc.) and pass `WalletWithRequiredFeatures` to the Sui provider, we recommend using the [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit) library.

Below is a simplified example of how to set up the Sui provider with user wallets.

<CodeGroup>
  ```typescript SDKProviders.tsx
  import { Sui, config, createConfig } from '@lifi/sdk';
  import { useCurrentWallet } from '@mysten/dapp-kit';
  import { useEffect } from 'react';

  createConfig({
    integrator: 'Your dApp/company name',
  });

  export const SDKProviders = () => {
    const { currentWallet } = useCurrentWallet();

    useEffect(() => {
      // Configure Sui SDK provider
      config.setProviders([
        Sui({
          async getWallet() {
            return currentWallet!;
          },
        }),
      ]);
    }, [currentWallet]);

    return null;
  };
  ```

  ```typescript SuiProvider.tsx
  import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
  import { getFullnodeUrl } from '@mysten/sui/client';
  import { type FC, type PropsWithChildren } from 'react';
  import { SDKProviders } from './SDKProviders.js';

  const { networkConfig } = createNetworkConfig({
  	mainnet: { url: getFullnodeUrl('mainnet') },
  });

  export const SuiBaseProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          {/* Configure Sui SDK provider */}
          <SDKProviders />
          {children}
        </WalletProvider>
      </SuiClientProvider>
    );
  };
  ```
</CodeGroup>
