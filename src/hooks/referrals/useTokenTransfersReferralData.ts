import { useQuery } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { SUBGRAPH_WITH_REFERRAL_URL } from "../../constants/subgraph"
import { TokenTransfersQuery, TokenTransfersQueryVariables } from "../../types/referrals"

const TOKEN_TRANSFERS_QUERY = gql`
  query TokenTransfersQuery($to: Bytes!, $from: Bytes!, $token: String!) {
    tokenTransfers(where: { to: $to, from: $from, token: $token }) {
      amount
      from
      to
      transaction {
        id
        timestamp
      }
    }
  }
`

export function useTokenTransfersReferralData(
  address: string | undefined | null,
  referralListAddress: string | undefined | null,
  token: string | undefined | null
) {
  const accountAddress = address?.toLowerCase()
  const referralAddress = referralListAddress?.toLowerCase()
  const tokenAddress = token?.toLowerCase()

  const query = useQuery<TokenTransfersQuery, Error>({
    queryKey: ["tokenTransfers", accountAddress, referralAddress, tokenAddress],
    queryFn: async () => {
      if (!accountAddress || !referralAddress || !tokenAddress) {
        throw new Error("Missing required parameters for token transfers query")
      }

      return request<TokenTransfersQuery, TokenTransfersQueryVariables>(
        SUBGRAPH_WITH_REFERRAL_URL,
        TOKEN_TRANSFERS_QUERY,
        { to: accountAddress, from: referralAddress, token: tokenAddress }
      )
    },
    enabled: !!accountAddress && !!referralAddress && !!tokenAddress,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isUninitialized: !(accountAddress && referralAddress && tokenAddress),
    isError: query.isError,
    error: query.error,
    tokenTransfersData: query.data,
    refetch: query.refetch,
  }
}