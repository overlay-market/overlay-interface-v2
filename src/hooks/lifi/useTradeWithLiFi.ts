import { useCallback } from "react";
import { useAddPopup } from "../../state/application/hooks";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";
import { useTradeState } from "../../state/trade/hooks";
import useAccount from "../useAccount";

export const useTradeWithLiFi = () => {
  const { address, chainId } = useAccount();
  const { currentMarket } = useCurrentMarketState();
  const { typedValue, selectedLeverage, isLong, chainState, tokenState, selectedChainId } = useTradeState();
  const addPopup = useAddPopup();

  const handleTradeWithLifi = useCallback(async () => {
    try {
      console.log("Selected state action triggered");
      
      // Your custom logic for selected state
      if (!address || !currentMarket) {
        console.warn('Missing required data for selected state action');
        return;
      }     

   
      // Handle success
    //   addPopup({
    //     txn: {
    //       hash: result.hash,
    //       success: result.receipt?.status === "success",
    //       message: "Trade with LiFi completed",
    //       type: "Trade with LiFi", 
    //     },
    //   }, result.hash);
      
    } catch (error) {
      console.error('Selected state action failed:', error);
      
    //   // Handle error
    //   addPopup({
    //     txn: {
    //       hash: Date.now().toString(),
    //       success: false,
    //       message: error instanceof Error ? error.message : 'Selected state action failed',
    //       type: "ERROR",
    //     },
    //   }, Date.now().toString());
    }
  }, [
    address,
    chainId,
    selectedChainId,
    currentMarket,
    chainState,
    tokenState,
    typedValue,
    selectedLeverage,
    isLong,
    addPopup
  ]);

  return {
    handleTradeWithLifi,
  };
};