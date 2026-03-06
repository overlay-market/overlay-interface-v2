import { useQuery } from "@tanstack/react-query";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

export const useAffiliateAddress = (alias?: string) => {
  return useQuery({
    queryKey: ["affiliateAddress", alias?.toLowerCase()],
    queryFn: async () => {
      if (!alias) return null;
      const res = await fetch(
        `${REFERRAL_API_BASE_URL}/affiliates/aliases/${alias.toLowerCase()}`
      );
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch affiliate address");
      return res.json() as Promise<{ address: string }>;
    },
    enabled: !!alias,
    staleTime: 1000 * 60, // cache for 1 min
  });
};