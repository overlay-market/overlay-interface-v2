import { Address } from "viem";
import { LEADERBOARD_POINTS_API } from "../../../constants/applications";
import { LeaderboardPointsData } from "../types";

export const fetchPointsData = async (
  numberOfRows: number, 
  account: Address | undefined,
  setFetchingPointsData: (value: boolean) => void,
) => {
  setFetchingPointsData(true);
  try {
    const response = await fetch(
      LEADERBOARD_POINTS_API +
        `/${numberOfRows}${account ? `/${account}` : ""}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch points data: ${response.statusText}`);
    }
    const data: LeaderboardPointsData = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getting points data:", error);
    return undefined;
  } finally {
    setFetchingPointsData(false);
  }
};