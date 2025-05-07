import {
  GET_USERS_POWER_CARDS,
  GET_ALL_POWER_CARDS,
} from "../pages/PowerCards/PowerCardsGrid/PowerCard/queries";
import { useQuery as apolloUseQuery } from "@apollo/client";
import useAccount from "../hooks/useAccount";

export const useUserPowerCards = () => {
  const { address: account } = useAccount();
  const result = apolloUseQuery(GET_USERS_POWER_CARDS, {
    variables: { accountId: account },
    skip: !account,
  });

  return {
    loading: result.loading,
    error: result.error,
    data: result.data,
    refetch: result.refetch,
  };
};

export const useAllPowerCards = () => {
  const result = apolloUseQuery(GET_ALL_POWER_CARDS);

  return {
    loading: result.loading,
    error: result.error,
    data: result.data,
  };
};
