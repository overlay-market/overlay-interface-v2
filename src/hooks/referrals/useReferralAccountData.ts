import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { SUBGRAPH_WITH_REFERRAL_URL } from "../../constants/subgraph";
import { ReferralAccountQuery, ReferralAccountQueryVariables } from "../../types/referrals";

const REFERRAL_ACCOUNT_QUERY = gql`
  query ReferralAccountQuery($account: ID!) {
    account(id: $account) {
      id
      ovlVolumeTraded
      referralPositions {
        id
        tier
        totalAffiliateComission
        totalAirdroppedAmount
        totalRewardsPending
        totalTraderDiscount
        accountsReferred
        affiliatedTo {
          id
        }
      }
    }
  }
`;

export function useReferralAccountData(address: string | undefined) {
  const accountAddress = address?.toLowerCase();

  const query = useQuery<ReferralAccountQuery, Error>({
    queryKey: ["referralAccount", accountAddress],
    queryFn: async () => {
      if (!accountAddress) throw new Error("No account address provided");

      return request<ReferralAccountQuery, ReferralAccountQueryVariables>(
        SUBGRAPH_WITH_REFERRAL_URL,
        REFERRAL_ACCOUNT_QUERY,
        { account: accountAddress }
      );
    },
    enabled: !!accountAddress, 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isUninitialized: !accountAddress,
    isError: query.isError,
    error: query.error,
    referralAccountData: query.data,
    refetch: query.refetch,
  };
}