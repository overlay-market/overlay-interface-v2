import { useQuery } from "@tanstack/react-query";
import { FUNDED_TRADER_API } from "../constants/applications";

export interface PayoutDateData {
  firstTradeDate: string;
  nextPayoutDate: string;
  payoutIntervalDays: number;
}

export const usePayoutDate = (
  safeAddress: string | undefined,
  enabled: boolean
) => {
  const fetchPayoutDate = async (): Promise<PayoutDateData> => {
    const response = await fetch(
      `${FUNDED_TRADER_API}/api/v1/safe/${safeAddress}/payout-date`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch payout date: ${response.statusText}`
      );
    }
    return response.json();
  };

  return useQuery({
    queryKey: ["payoutDate", safeAddress],
    queryFn: fetchPayoutDate,
    enabled: enabled && !!safeAddress,
    refetchInterval: 300_000,
    staleTime: 300_000,
  });
};
