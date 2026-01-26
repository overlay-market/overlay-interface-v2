import { useQuery } from "@tanstack/react-query";
import { Address, zeroAddress } from "viem";
import useSDK from "../providers/SDKProvider/useSDK";
import useAccount from "./useAccount";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import { SHIVA_ADDRESS } from "../constants/applications";
import { CHAINS } from "overlay-sdk";

export interface PositionPnLData {
  value: bigint;
  cost: bigint;
  tradingFee: bigint;
  pnl: bigint;
  pnlFormatted: number; // PnL in OVL (decimal format)
  pnlUSDT?: string; // PnL in USDT for LBSC positions
  timestamp: number;
}

export interface PositionsPnLResult {
  pnlData: Map<string, PositionPnLData>;
  prices?: {
    bid: bigint;
    ask: bigint;
    mid: bigint;
  };
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

const usePositionsPnL = (
  marketId: string | null,
  positions: Position[]
): PositionsPnLResult => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const { chainId } = useMultichainContext();

  const { data } = useQuery({
    queryKey: [
      "positionsPnL",
      chainId,
      marketId,
      positions.map(p => p.positionId).sort((a, b) => a - b).join(','), // Stable string
    ],
    queryFn: async () => {
      if (!marketId || !account || positions.length === 0 || !chainId) {
        return { pnlData: new Map<string, PositionPnLData>() };
      }

      const marketAddress = positions[0].marketAddress;

      // Prepare positions for SDK call
      const positionsData = positions.map(pos => ({
        positionId: BigInt(pos.positionId),
        walletAddress: (pos.router?.id === zeroAddress
          ? account
          : SHIVA_ADDRESS[chainId as keyof typeof SHIVA_ADDRESS]) as Address,
        loan: pos.loan,
      }));

      // Call new SDK method that combines bid/ask + PnL
      try {
        const result = await sdk.openPositions.getPositionsPnLWithPrices(
          chainId as CHAINS,
          marketAddress,
          positionsData,
          true  // includeOraclePrice for LBSC
        );

        // Convert result to include timestamp for each position
        const pnlMap = new Map<string, PositionPnLData>();
        result.positions.forEach((data: {
          value: bigint;
          cost: bigint;
          tradingFee: bigint;
          pnl: bigint;
          pnlFormatted: number;
          pnlUSDT?: string;
        }, key: string) => {
          pnlMap.set(key, {
            ...data,
            timestamp: result.timestamp,
          });
        });

        return {
          pnlData: pnlMap,
          prices: result.prices,
        };
      } catch (error) {
        console.error('[usePositionsPnL] Error fetching PnL:', error);
        throw error;
      }
    },
    enabled: Boolean(marketId && account && positions.length > 0 && sdk && chainId),
    staleTime: 10_000,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
  });

  return data ?? { pnlData: new Map<string, PositionPnLData>() };
};

export default usePositionsPnL;
