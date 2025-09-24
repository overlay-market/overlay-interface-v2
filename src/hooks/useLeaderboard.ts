import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { PermanentLeaderboardData, Ranking, Season } from "../pages/Leaderboard/types";
import { PERMANENT_LEADERBOARD_API } from "../constants/applications";
import { RANKING_BY } from "../pages/Leaderboard/LeaderboardTable/leaderboardConfig";


export const useLeaderboard = (
  numberOfRows: number,
  walletAddress: Address | undefined,
  seasonId?: string,
  sortBy?: Ranking
) => {
  const endpointBase = seasonId ? `seasonal/${seasonId}` : "all-time";
  const endpoint = `${endpointBase}/leaderboard/${numberOfRows}
    ${walletAddress ? `/${walletAddress}` : ""}
    ${(sortBy || !seasonId) ? "?sortBy=" + (sortBy || RANKING_BY) : ""}`;

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
    queryKey: [
      "permanentLeaderboard",
      numberOfRows,
      walletAddress,
      RANKING_BY,
      seasonId,
    ],
    queryFn: fetchPermanentLeaderboard,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 10 * 60 * 1000, 
  });
};

export const useSeasons = () => {
  const fetchSeasons = async (): Promise<Season[]> => {
    const response = await fetch(`${PERMANENT_LEADERBOARD_API}seasons`);
    if (!response.ok) {
      throw new Error(`Failed to fetch seasons: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch seasons");
    }

    return data.data as Season[];
  };

  return useQuery({
    queryKey: ["leaderboardSeasons"],
    queryFn: fetchSeasons,
    staleTime: 10 * 60 * 1000,
  });
};
