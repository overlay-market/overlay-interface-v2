import {
  GET_USERS_POWER_CARDS,
  GET_ALL_POWER_CARDS,
} from "../pages/PowerCards/PowerCardsGrid/PowerCard/queries";
import {
  useQuery as apolloUseQuery,
  DocumentNode,
  QueryHookOptions,
} from "@apollo/client";

export const useUserPowerCards = () => {
  console.log("GET_USERS_POWER_CARDS:", GET_USERS_POWER_CARDS.loc?.source.body);
  const { loading, error, data } = useQuery(GET_USERS_POWER_CARDS);

  return {
    loading,
    error,
    data,
  };
};

export const useAllPowerCards = () => {
  console.log("GET_ALL_POWER_CARDS:", GET_ALL_POWER_CARDS.loc?.source.body);
  const { loading, error, data } = useQuery(GET_ALL_POWER_CARDS);

  return {
    loading,
    error,
    data,
  };
};

function useQuery(query: DocumentNode, options?: QueryHookOptions) {
  const result = apolloUseQuery(query, options);
  return {
    loading: result.loading,
    error: result.error,
    data: result.data,
  };
}
