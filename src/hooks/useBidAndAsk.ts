import { limitDigitsInDecimals } from "overlay-sdk";
import { useEffect, useRef, useState } from "react";
import { TRADE_POLLING_INTERVAL } from "../constants/applications";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../providers/SDKProvider/useSDK";

interface BidAskData {
  ask: number | undefined;
  bid: number | undefined;
  timestamp: number;
}

interface UpdateCallback {
  (data: { ask: number | undefined; bid: number | undefined }): void;
}

interface PollingData {
  interval: NodeJS.Timeout | null;
  subscribers: Set<UpdateCallback>;
}

const bidAskCache = new Map<string, BidAskData>();
const activePolling = new Map<string, PollingData>();

const useBidAndAsk = (marketId: string | null): {bid: number | undefined, ask: number | undefined} => {
  const { chainId } = useMultichainContext();   
  const sdk = useSDK(); 
  const [ask, setAsk] = useState<number | undefined>(undefined); 
  const [bid, setBid] = useState<number | undefined>(undefined); 

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const cacheKey = `${chainId}-${marketId}`;

  useEffect(() => {
    setAsk(undefined); 
    setBid(undefined);
  }, [marketId, chainId]); 

  useEffect(() => {
    if (!marketId || !sdk) return;

    const cachedData = bidAskCache.get(cacheKey);
    if (cachedData && cachedData.timestamp > Date.now() - 5000) { 
      setAsk(cachedData.ask);
      setBid(cachedData.bid);
    }

    const fetchBidAndAsk = async () => {
      try {
        const bidAndAsk = await sdkRef.current.trade.getBidAndAsk(marketId, 8); 
        console.log({bidAndAsk})
        const processedAsk = bidAndAsk && limitDigitsInDecimals(bidAndAsk.ask as number).replaceAll(",", "");  
        const processedBid = bidAndAsk && limitDigitsInDecimals(bidAndAsk.bid as number).replaceAll(",", "");
        
        const askValue = processedAsk ? Number(processedAsk) : undefined;
        const bidValue = processedBid ? Number(processedBid) : undefined;

        bidAskCache.set(cacheKey, {
          ask: askValue,
          bid: bidValue,
          timestamp: Date.now()
        });

        const subscribers = activePolling.get(cacheKey)?.subscribers || new Set();
        subscribers.forEach(callback => callback({ ask: askValue, bid: bidValue }));

      } catch (error) { 
        console.error("Error fetching bid and ask:", error); 
      }
    }; 

    if (!activePolling.has(cacheKey)) {
      activePolling.set(cacheKey, {
        interval: null,
        subscribers: new Set()
      });
    }

    const pollingData = activePolling.get(cacheKey)!;
    const updateCallback: UpdateCallback = ({ ask, bid }) => {
      setAsk(ask);
      setBid(bid);
    };
    
    pollingData.subscribers.add(updateCallback);

    if (pollingData.subscribers.size === 1) {
      fetchBidAndAsk(); 
      pollingData.interval = setInterval(fetchBidAndAsk, TRADE_POLLING_INTERVAL);
    } else {
      const cached = bidAskCache.get(cacheKey);
      if (cached) {
        setAsk(cached.ask);
        setBid(cached.bid);
      }
    }

    return () => {
      const currentPolling = activePolling.get(cacheKey);
      if (currentPolling) {
        currentPolling.subscribers.delete(updateCallback);
        
        if (currentPolling.subscribers.size === 0) {
          if (currentPolling.interval) {
            clearInterval(currentPolling.interval);
          }
          activePolling.delete(cacheKey);
          bidAskCache.delete(cacheKey);
        }
      }
    };
  }, [marketId, chainId, cacheKey]);

  return { bid, ask } as const;
};

export default useBidAndAsk;