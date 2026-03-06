import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { referralListAbi } from "./abis/referralListAbi";
import { REFERRAL_LIST_ADDRESS } from "../../constants/applications";
import useAccount from "../useAccount";

export function useReferralTierRates(tier: number | undefined) {
  const { chainId } = useAccount();
  const publicClient = usePublicClient();

  const referralListAddress = chainId
    ? REFERRAL_LIST_ADDRESS[chainId]
    : undefined;

  return useQuery({
    queryKey: ["referralTierRates", chainId, tier],
    queryFn: async () => {
      if (!publicClient || !referralListAddress || tier === undefined)
        throw new Error("Missing dependencies");

      const results = await publicClient.multicall({
        contracts: [
          {
            address: referralListAddress as `0x${string}`,
            abi: referralListAbi,
            functionName: "tierAffiliateComission",
            args: [tier],
          },
          {
            address: referralListAddress as `0x${string}`,
            abi: referralListAbi,
            functionName: "tierTraderDiscount",
            args: [tier],
          },
        ],
      });

      const commission = results[0].status === "success" ? Number(results[0].result) : 0;
      const discount = results[1].status === "success" ? Number(results[1].result) : 0;

      return {
        affiliateCommission: commission / 100,
        traderDiscount: discount / 100,
      };
    },
    enabled: !!publicClient && !!referralListAddress && tier !== undefined,
    staleTime: 5 * 60 * 1000,
  });
}
