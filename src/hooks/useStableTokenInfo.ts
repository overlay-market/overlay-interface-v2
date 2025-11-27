import { useQuery } from "@tanstack/react-query";
import useSDK from "../providers/SDKProvider/useSDK";
import { Address } from "viem";

export type StableTokenInfo = {
  address: Address;
  decimals: number;
  oraclePrice?: bigint;
};

type UseStableTokenInfoOptions = {
  includeOraclePrice?: boolean;
};

export const useStableTokenInfo = (options?: UseStableTokenInfoOptions) => {
  const sdk = useSDK();
  const chainId = sdk.core.chainId;
  const includeOraclePrice = options?.includeOraclePrice ?? false;

  return useQuery<StableTokenInfo, Error>({
    queryKey: ["stableTokenInfo", chainId, includeOraclePrice],
    queryFn: async () => {
      const stableTokenAddress = await sdk.lbsc.getStableTokenAddress();

      const decimals = await sdk.core.rpcProvider.readContract({
        address: stableTokenAddress,
        abi: [
          {
            type: "function",
            name: "decimals",
            inputs: [],
            outputs: [{ name: "", type: "uint8" }],
            stateMutability: "view",
          },
        ],
        functionName: "decimals",
      });

      let oraclePrice: bigint | undefined;
      if (includeOraclePrice) {
        oraclePrice = await sdk.lbsc.getOraclePrice();
      }

      return {
        address: stableTokenAddress,
        decimals: Number(decimals),
        oraclePrice,
      };
    },
    staleTime: 30 * 1000, // cache for 30 seconds
    refetchInterval: 30 * 1000, // refetch every 30 seconds
  });
};
