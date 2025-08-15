import { useAccount } from "wagmi";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../providers/SDKProvider/useSDK";
import { useChainAndTokenState, useTradeState } from "../state/trade/hooks";
import { SelectState } from "../types/selectChainAndTokenTypes";
import { toWei } from "overlay-sdk";
import { useSelectedTokenBalance } from "./lifi/useSelectedTokenBalance";
import { calculateOvlAmountFromToken } from "../utils/lifi/tokenOvlConversion";
import { useQuery } from "@tanstack/react-query";
import { serializeWithBigInt } from "../utils/serializeWithBigInt";
import { useOvlPrice } from "./useOvlPrice";

interface UseMaxInputIncludingFeesParams {
  marketId: string | null | undefined;
}

export const useMaxInputIncludingFees = ({
  marketId,
}: UseMaxInputIncludingFeesParams) => {
  const { address } = useAccount();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { selectedLeverage } = useTradeState();
  const { chainState, tokenState } = useChainAndTokenState();
  const { data: selectedToken } = useSelectedTokenBalance();
   const { data: ovlPrice } = useOvlPrice();

  const isDefaultState = chainState === SelectState.DEFAULT && tokenState === SelectState.DEFAULT;
  const isSelectedState = chainState === SelectState.SELECTED && tokenState === SelectState.SELECTED;

  const enabled = Boolean(
    address &&
    marketId &&
    (isDefaultState || (isSelectedState && selectedToken))
  );

  const query = useQuery({
    queryKey: [
      'maxInputIncludingFees',
      marketId,
      address,
      selectedLeverage,
      chainId,
      serializeWithBigInt(selectedToken), 
      chainState,
      tokenState,
    ],
    queryFn: async () => {
      if (!address || !marketId) return 0;

      if (isDefaultState) {
        return await sdk.trade.getMaxInputIncludingFees(
          marketId,
          address,
          toWei(selectedLeverage),
          6
        );
      }

      if (!ovlPrice) return 0;

      if (isSelectedState && selectedToken) {
        const ovlAmount = calculateOvlAmountFromToken(selectedToken, ovlPrice);
        return await sdk.trade.getMaxInputIncludingFeesFromBalance(
          marketId,
          ovlAmount,
          toWei(selectedLeverage),
          6
        );
      }

      return 0;
    },
    enabled,
  });

  return {
    maxInputIncludingFees: query.data ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
};
