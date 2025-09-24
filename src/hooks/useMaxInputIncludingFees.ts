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
import { parseUnits } from "viem";
import { OVL_DECIMALS } from "../constants/applications";

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
        
        // Check if it's a native token (0x0000... address)
        const isNativeToken = selectedToken.address.toLowerCase().startsWith('0x0000');
        
        let safeOvlAmount: bigint;
        
        if (isNativeToken) {
          // For native tokens, use minimum gas reserve of ~$1.50
          const minGasInUSD = 1.5;
          const gasReserveInOvl = parseUnits((minGasInUSD / ovlPrice).toFixed(18), OVL_DECIMALS);
          
          // Use larger of 20% or minimum gas reserve
          const percentReserve = (ovlAmount * 20n) / 100n;
          const actualReserve = gasReserveInOvl > percentReserve ? gasReserveInOvl : percentReserve;
          
          safeOvlAmount = ovlAmount > actualReserve ? ovlAmount - actualReserve : 0n;
        } else {
          // ERC20 tokens: just 5% buffer for safety
          safeOvlAmount = (ovlAmount * 95n) / 100n;
        }
        
        return await sdk.trade.getMaxInputIncludingFeesFromBalance(
          marketId,
          safeOvlAmount,
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
