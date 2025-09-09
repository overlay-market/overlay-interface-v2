import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { PermanentLeaderboardData } from "../pages/Leaderboard/types";
import { PERMANENT_LEADERBOARD_API } from "../constants/applications";
import { RANKING_BY } from "../pages/Leaderboard/LeaderboardTable/leaderboardConfig";


export const usePermanentLeaderboard = (
  numberOfRows: number,
  walletAddress: Address | undefined,
) => {
  const endpoint = `all-time/leaderboard/${numberOfRows}${
    walletAddress ? `/${walletAddress}` : ""
  }?sortBy=${RANKING_BY}`;

  const fetchPermanentLeaderboard = async (): Promise<PermanentLeaderboardData> => {
    const response = await fetch(`${PERMANENT_LEADERBOARD_API}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard data: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch leaderboard data");
    }
    return data.data; 
  };

  return useQuery({
    queryKey: ['permanentLeaderboard', numberOfRows, walletAddress, RANKING_BY],
    queryFn: fetchPermanentLeaderboard,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 10 * 60 * 1000, 
  });
};