import { ExpandedMarketData } from "overlay-sdk";
import { MarketDataParsed } from "../types/marketTypes";
import { useQuery } from "@tanstack/react-query";
import useSDK from "../providers/SDKProvider/useSDK";

const useActiveMarkets = () => {
    const sdk = useSDK();
    const chainId = sdk.core.chainId;

    return useQuery<MarketDataParsed[]>({
        queryKey: ['activeMarkets', chainId],
        queryFn: async () => {
            if (!sdk.markets.getActiveMarkets) {
                return [];
            }
            const activeMarkets = await sdk.markets.getActiveMarkets();

            const marketsParsed = activeMarkets.map((market: ExpandedMarketData) => {
                return {
                    ...market,
                    ask: market.ask.toString(),
                    bid: market.bid.toString(),
                    capOi: market.capOi.toString(),
                    circuitBreakerLevel: market.circuitBreakerLevel.toString(),
                    fundingRate: market.fundingRate.toString(),
                    mid: market.mid.toString(),
                    oiLong: market.oiLong.toString(),
                    oiShort: market.oiShort.toString(),
                    volumeAsk: market.volumeAsk.toString(),
                    volumeBid: market.volumeBid.toString(),
                    parsedAnnualFundingRate: market.parsedAnnualFundingRate?.toString(),
                    parsedAsk: market.parsedAsk?.toString(),
                    parsedBid: market.parsedBid?.toString(),
                    parsedCapOi: market.parsedCapOi?.toString(),
                    parsedDailyFundingRate: market.parsedDailyFundingRate?.toString(),
                    parsedMid: market.parsedMid?.toString(),
                    parsedOiLong: market.parsedOiLong?.toString(),
                    parsedOiShort: market.parsedOiShort?.toString(),
                };
            });

            return marketsParsed;
        },
        enabled: !!sdk.markets.getActiveMarkets,
        refetchInterval: 30 * 60 * 1000, // Refetch every 30 min
        staleTime: 30 * 60 * 1000,
    });
};

export default useActiveMarkets;