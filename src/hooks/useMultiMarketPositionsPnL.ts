import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Address, zeroAddress } from "viem";
import useSDK from "../providers/SDKProvider/useSDK";
import useAccount from "./useAccount";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import { SHIVA_ADDRESS } from "../constants/applications";
import { CHAINS } from "overlay-sdk";
import type { PositionPnLEntry } from "overlay-sdk";

export type { PositionPnLEntry };

export interface MarketPrices {
  bid: bigint;
  ask: bigint;
  mid: bigint;
}

export interface MultiMarketPnLHookResult {
  pnlData: Map<string, PositionPnLEntry>;
  marketPrices: Map<string, MarketPrices>;
  isLoading: boolean;
}

interface Position {
  marketAddress: Address;
  positionId: number;
  router?: { id: Address } | null;
  loan?: {
    ovlAmount: string;
    stableAmount: string;
  } | null;
}

const EMPTY_PNL_MAP = new Map<string, PositionPnLEntry>();
const EMPTY_PRICES_MAP = new Map<string, MarketPrices>();

const useMultiMarketPositionsPnL = (
  positions: Position[] | undefined,
  options?: { isRefreshing?: boolean }
): MultiMarketPnLHookResult => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const { chainId } = useMultichainContext();

  // Group positions by marketAddress
  const marketGroups = useMemo(() => {
    if (!positions || positions.length === 0 || !account || !chainId) return [];

    const groupMap = new Map<
      string,
      {
        marketAddress: Address;
        positions: Array<{
          positionId: bigint;
          walletAddress: Address;
          loan?: { ovlAmount: string; stableAmount: string } | null;
        }>;
      }
    >();

    for (const pos of positions) {
      const key = pos.marketAddress.toLowerCase();
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          marketAddress: pos.marketAddress,
          positions: [],
        });
      }

      const walletAddress = (
        pos.router?.id === zeroAddress
          ? account
          : SHIVA_ADDRESS[chainId as keyof typeof SHIVA_ADDRESS]
      ) as Address;

      groupMap.get(key)!.positions.push({
        positionId: BigInt(pos.positionId),
        walletAddress,
        loan: pos.loan,
      });
    }

    return Array.from(groupMap.values());
  }, [positions, account, chainId]);

  // Stable query key from sorted position IDs
  const positionIdsKey = useMemo(() => {
    if (!positions || positions.length === 0) return "";
    return positions
      .map((p) => p.positionId)
      .sort((a, b) => a - b)
      .join(",");
  }, [positions]);

  const { data, isLoading } = useQuery({
    queryKey: ["multiMarketPnL", chainId, account, positionIdsKey],
    queryFn: async () => {
      if (marketGroups.length === 0) {
        return {
          positions: new Map<string, PositionPnLEntry>(),
          marketPrices: new Map<string, MarketPrices>(),
        };
      }

      const result = await sdk.openPositions.getMultiMarketPositionsPnL(
        chainId as CHAINS,
        marketGroups
      );

      return {
        positions: result.positions,
        marketPrices: result.marketPrices,
      };
    },
    enabled: Boolean(
      account && positions && positions.length > 0 && sdk && chainId && marketGroups.length > 0
    ),
    staleTime: 10_000,
    refetchInterval: options?.isRefreshing ? false : 10_000,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
  });

  return {
    pnlData: data?.positions ?? EMPTY_PNL_MAP,
    marketPrices: data?.marketPrices ?? EMPTY_PRICES_MAP,
    isLoading,
  };
};

export default useMultiMarketPositionsPnL;
