import { useQuery } from "@tanstack/react-query";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

export const useAffiliateAlias = (address?: string) => {
  return useQuery({
    queryKey: ["affiliateAlias", address?.toLowerCase()],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(
        `${REFERRAL_API_BASE_URL}/affiliates/${address.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Failed to fetch affiliate alias");
      return res.json() as Promise<{ isValid: boolean; alias: string | null }>;
    },
    enabled: !!address,
    staleTime: 1000 * 60, // cache for 1 min
  });
};