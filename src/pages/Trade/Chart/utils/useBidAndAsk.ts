import { limitDigitsInDecimals } from "overlay-sdk";
import { useEffect, useState } from "react";
import { TRADE_POLLING_INTERVAL } from "../../../../constants/applications";
import useMultichainContext from "../../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../../providers/SDKProvider/useSDK";

const useBidAndAsk = (marketId: string | undefined): {bid: number | undefined, ask: number | undefined} => {
 
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  
  const [ask, setAsk] = useState<number | undefined>(undefined);
  const [bid, setBid] = useState<number | undefined>(undefined);

  useEffect(() => {
    setAsk(undefined);
    setBid(undefined);
  }, [marketId, chainId]);
  
  useEffect(() => {
    const fetchBidAndAsk = async () => {
      if (marketId) {
        try {
          const bidAndAsk = await sdk.trade.getBidAndAsk(marketId, 8);

          const ask =
            bidAndAsk &&
            limitDigitsInDecimals(bidAndAsk.ask as number).replaceAll(",", "");
          const bid =
            bidAndAsk &&
            limitDigitsInDecimals(bidAndAsk.bid as number).replaceAll(",", "");
          
          setAsk(Number(ask));
          setBid(Number(bid));
        } catch (error) {
          console.error("Error fetching bid and ask:", error);
        }
      }
    };

    fetchBidAndAsk();
    const intervalId = setInterval(fetchBidAndAsk, TRADE_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [marketId, chainId, sdk]);

  return {bid, ask}
}

export default useBidAndAsk;