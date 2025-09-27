import { useQuery } from "@tanstack/react-query";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

export const useTraderStatus = (address?: string) => {
  return useQuery({
    queryKey: ["traderStatus", address?.toLowerCase()],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(
        `${REFERRAL_API_BASE_URL}/signatures/check/${address.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Failed to fetch trader status");
      return res.json() as Promise<{ affiliate: string }>;
    },
    enabled: !!address,
  });
};