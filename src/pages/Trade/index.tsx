import { Flex, Text } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect, useState } from "react";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import Chart from "./Chart";
import { useParams } from "react-router-dom";
import useSDK from "../../hooks/useSDK";
import { MarketData } from "../../types/marketTypes";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import Loader from "../../components/Loader";
import {
  useCurrentMarketActionHandlers,
  useCurrentMarketState,
} from "../../state/currentMarket/hooks";
import { useMarketsActionHandlers } from "../../state/markets/hooks";
import PositionsTable from "./PositionsTable";

const Trade: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { currentMarket } = useCurrentMarketState();
  const { handleTradeStateReset } = useTradeActionHandlers();
  const { handleCurrentMarketSet } = useCurrentMarketActionHandlers();
  const { handleMarketsUpdate } = useMarketsActionHandlers();

  const [markets, setMarkets] = useState<MarketData[] | undefined>(undefined);

  useEffect(() => {
    const fetchActiveMarkets = async () => {
      if (marketId) {
        try {
          const activeMarkets = await sdk.markets.getActiveMarkets();
          activeMarkets && setMarkets(activeMarkets);
        } catch (error) {
          console.error("Error fetching markets:", error);
        }
      }
    };

    fetchActiveMarkets();
  }, [chainId]);

  useEffect(() => {
    if (markets) {
      const currentMarket = markets.find(
        (market) => market.marketName === marketId
      );
      currentMarket && handleCurrentMarketSet(currentMarket);
    }
  }, [marketId, chainId, markets]);

  useEffect(() => {
    if (markets) {
      handleMarketsUpdate(markets);
    }
  }, [chainId, markets]);

  useEffect(() => {
    handleTradeStateReset();
  }, [marketId, chainId, handleTradeStateReset]);

  return (
    <Flex direction="column" width={"100%"}>
      <TradeHeader />

      <Flex direction="column" gap="20px">
        <Flex
          height={{ initial: "auto", sm: "561px" }}
          width={"100%"}
          direction={{ initial: "column-reverse", sm: "row" }}
          align={{ initial: "center", sm: "start" }}
          px={{ initial: "20px", sm: "0" }}
        >
          {currentMarket ? (
            <>
              <Chart />
              <TradeWidget />
            </>
          ) : (
            <Flex
              width={"100%"}
              height={"100%"}
              align={"center"}
              justify={"center"}
            >
              <Loader />
            </Flex>
          )}
        </Flex>
        <PositionsTable />
        <Text weight={"bold"} size={"5"}>
          About This Market
        </Text>
      </Flex>
    </Flex>
  );
};

export default Trade;
