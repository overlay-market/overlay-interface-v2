import { useQuery } from "@tanstack/react-query";
import { DATA_API_BASE_URL } from "../constants/applications";
import { CommunityPool } from "../types/communityPools";

const fetchCommunityPools = async (): Promise<CommunityPool[]> => {
  const response = await fetch(`${DATA_API_BASE_URL}/community-pools`);

  if (!response.ok) {
    throw new Error(`Failed to fetch community pools: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid community pools response");
  }

  return data as CommunityPool[];
};

export const useCommunityPools = () => {
  return useQuery({
    queryKey: ["communityPools"],
    queryFn: fetchCommunityPools,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
};
