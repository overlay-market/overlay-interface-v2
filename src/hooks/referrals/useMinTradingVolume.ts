import { useQuery } from "@tanstack/react-query";
import { formatBigNumber } from "../../utils/formatBigNumber";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

export const useMinTradingVolume = () => {
  return useQuery({
    queryKey: ["minTradingVolume"],
    queryFn: async () => {
      const res = await fetch(`${REFERRAL_API_BASE_URL}/min-trading-volume`);
      if (!res.ok) throw new Error("Failed to fetch minTradingVolume");
      const json = await res.json();

      return Number(formatBigNumber(json.minTradingVolume, 18, 0));
    },
    staleTime: 5 * 60 * 1000, 
  });
};