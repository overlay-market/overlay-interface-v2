import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { FUNDED_TRADER_API } from "../constants/applications";
import { FundedTraderStatsData } from "../pages/Portfolio/Overview/FundedTraderStats/types";

export const useFundedTraderStats = (
  safeAddress: Address | undefined,
  enabled: boolean
) => {
  const fetchStats = async (): Promise<FundedTraderStatsData> => {
    const response = await fetch(
      `${FUNDED_TRADER_API}/api/v1/safe/${safeAddress}/stats`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch funded trader stats: ${response.statusText}`
      );
    }
    return response.json();
  };

  return useQuery({
    queryKey: ["fundedTraderStats", safeAddress],
    queryFn: fetchStats,
    enabled: enabled && !!safeAddress,
    refetchInterval: 30_000,
    staleTime: 30_000,
  });
};
