import { useAccount } from "wagmi";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../providers/SDKProvider/useSDK";
import { useTradeState } from "../state/trade/hooks";
import { useEffect, useRef, useState } from "react";
import { SelectState } from "../types/selectChainAndTokenTypes";
import { toWei } from "overlay-sdk";
import { useSelectedTokenBalance } from "./lifi/useSelectedTokenBalance";
import { calculateOvlAmountFromToken } from "../utils/calculateOvlAmountFromToken";
import { OVL_USD_PRICE } from "../constants/applications";

interface UseMaxInputIncludingFeesParams {
  marketId: string | null;
}

export const useMaxInputIncludingFees = ({
  marketId,
}: UseMaxInputIncludingFeesParams) => {
  const { address } = useAccount();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { selectedLeverage, chainState, tokenState } =
      useTradeState();
  const { data: selectedToken } = useSelectedTokenBalance();

  const [maxInputIncludingFees, setMaxInputIncludingFees] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const sdkRef = useRef(sdk);
  
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  useEffect(() => {
    const fetchMaxInput = async () => {
      setError(null);
      
      if (!address || !marketId) {
        setMaxInputIncludingFees(0);
        return;
      }

      const isDefaultState = chainState === SelectState.DEFAULT && tokenState === SelectState.DEFAULT;
      const isSelectedState = chainState === SelectState.SELECTED && tokenState === SelectState.SELECTED;
      
      if (!isDefaultState && !isSelectedState) {
        setMaxInputIncludingFees(0);
        return;
      }

      setIsLoading(true);

      try {
        let maxInput: number;

        if (isDefaultState) {
          maxInput = await sdkRef.current.trade.getMaxInputIncludingFees(
            marketId,
            address,
            toWei(selectedLeverage),
            6
          );
        } else if (isSelectedState && selectedToken) {
          const ovlAmount = calculateOvlAmountFromToken(selectedToken, OVL_USD_PRICE);
          maxInput = await sdkRef.current.trade.getMaxInputIncludingFeesFromBalance(
            marketId,
            ovlAmount,
            toWei(selectedLeverage),
            6
          );
        } else {
          setIsLoading(false);
          return;
        }

        if (maxInput) {
          setMaxInputIncludingFees(maxInput);
        }
      } catch (error) {
        console.error("Error fetching maxInputIncludingFees:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setMaxInputIncludingFees(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaxInput();
  }, [marketId, address, selectedLeverage, chainId, selectedToken, chainState, tokenState]);

  return { 
    maxInputIncludingFees, 
    isLoading, 
    error  
  };
};