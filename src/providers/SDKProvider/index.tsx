// context/SDKContext.tsx
import React, { useMemo } from "react";
import { OverlaySDK } from "overlay-sdk";
import { useConnectorClient } from "wagmi";
import { DEFAULT_CHAINID, SUPPORTED_CHAINID } from "../../constants/chains";
import useMultichainContext from "../MultichainContextProvider/useMultichainContext";
import { SDKContext } from "./types";
import { useAvatarTrading } from "../../hooks/useZodiacRoles";
import { encodeFunctionData } from "viem";
import { ROLES_MODIFIER_ABI } from "../../constants/abis/rolesModifier";
import { TRADE_ROLE_KEY } from "../../constants/zodiac";

const SDKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId } = useMultichainContext();
  const { data: walletClient } = useConnectorClient();
  const { isAvatarTradingActive, activeAvatar } = useAvatarTrading();

  const wrappedWalletClient = useMemo(() => {
    if (!walletClient || !isAvatarTradingActive || !activeAvatar) {
      return walletClient;
    }

    console.log("Zodiac Proxy: active", {
      signer: walletClient.account?.address,
      avatar: activeAvatar.avatar,
      modifier: activeAvatar.address
    });

    return new Proxy(walletClient, {
      get(target, prop, receiver) {
        const originalValue = Reflect.get(target, prop, receiver);

        if (prop === "request") {
          return async (args: any) => {
            if (args.method === "eth_sendTransaction" && isAvatarTradingActive && activeAvatar) {
              const txn = args.params?.[0];
              if (txn) {
                console.log("Zodiac Proxy: eth_sendTransaction intercepted", txn);

                const wrappedData = encodeFunctionData({
                  abi: ROLES_MODIFIER_ABI,
                  functionName: "execTransactionWithRole",
                  args: [
                    txn.to,
                    txn.value ? BigInt(txn.value) : 0n,
                    txn.data || "0x",
                    0,
                    TRADE_ROLE_KEY,
                    true,
                  ],
                });

                const wrappedTxn = {
                  ...txn,
                  from: walletClient.account?.address,
                  to: activeAvatar.address,
                  value: "0x0",
                  data: wrappedData,
                };

                // Strip fields that should be re-calculated for the signer (EOA)
                delete wrappedTxn.gas;
                delete wrappedTxn.nonce;
                delete wrappedTxn.chainId;

                // If fees are suspiciously low (e.g. mock 1 wei), let MetaMask estimate
                const isSuspiciouslyLow = (val: string) => val === "0x1" || val === "0x0";
                if (isSuspiciouslyLow(wrappedTxn.maxFeePerGas)) delete wrappedTxn.maxFeePerGas;
                if (isSuspiciouslyLow(wrappedTxn.maxPriorityFeePerGas)) delete wrappedTxn.maxPriorityFeePerGas;
                if (isSuspiciouslyLow(wrappedTxn.gasPrice)) delete wrappedTxn.gasPrice;

                console.log("Zodiac Proxy: sending wrapped request", wrappedTxn);
                if (typeof originalValue === "function") {
                  return originalValue.apply(target, [{ ...args, params: [wrappedTxn] }]);
                }
              }
              return;
            }

            // Diagnostic: check if simulation is using wrong 'from'
            if ((args.method === "eth_call" || args.method === "eth_estimateGas") && isAvatarTradingActive && activeAvatar) {
              const txn = args.params[0];
              const isModifierCall = txn?.to?.toLowerCase() === activeAvatar.address.toLowerCase();
              if (txn && txn.from && walletClient.account && txn.from.toLowerCase() === walletClient.account.address.toLowerCase() && !isModifierCall) {
                console.warn(`Zodiac Proxy: overriding ${args.method} from EOA to Avatar: ${activeAvatar.avatar} for target: ${txn.to}`);
                txn.from = activeAvatar.avatar;
              }
            }

            if (typeof originalValue === "function") {
              const resultPromise = originalValue.apply(target, [args]);
              if (args.method === "eth_call" || args.method === "eth_estimateGas") {
                resultPromise.catch((err: any) => {
                  console.error(`Zodiac Proxy: ${args.method} FAILED:`, err);
                });
              }
              return resultPromise;
            }
            return originalValue;
          };
        }

        // Bind functions to the target to preserve 'this'
        if (typeof originalValue === "function") {
          return originalValue.bind(target);
        }

        return originalValue;
      },
    });
  }, [walletClient, isAvatarTradingActive, activeAvatar]);

  const sdk = useMemo(() => {
    return new OverlaySDK({
      chainId: chainId ? (chainId as number) : (DEFAULT_CHAINID as number),
      rpcUrls: {
        [SUPPORTED_CHAINID.BSC_MAINNET]: import.meta.env.VITE_BSC_MAINNET_RPC,
        [SUPPORTED_CHAINID.BSC_TESTNET]: import.meta.env.VITE_BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545",
      },
      web3Provider: wrappedWalletClient as any,
      useShiva: true,
      oneInchApiBaseUrl: import.meta.env.VITE_ONE_INCH_BASE_URL,
    });
  }, [chainId, wrappedWalletClient]);

  console.log("SDK instance created with chainId:", chainId);

  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export default SDKProvider;
