import { Flex, Box } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect, useState } from "react";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import Chart from "./Chart";
import { useParams } from "react-router-dom";
import useSDK from "../../hooks/useSDK";
import { MarketData } from "../../types/marketTypes";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";

const Trade: React.FC = () => {
  const { handleTradeStateReset } = useTradeActionHandlers();
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const [markets, setMarkets] = useState<MarketData[] | undefined>(undefined);
  const [currentMarket, setCurrentMarket] = useState<MarketData | undefined>(
    undefined
  );

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
  }, [marketId, chainId]);

  useEffect(() => {
    if (markets) {
      const curMarket = markets.find(
        (market) => market.marketName === marketId
      );
      curMarket && setCurrentMarket(curMarket);
    }
  }, [marketId, chainId, markets]);

  const longPrice = "17.1916".toString();
  const shortPrice = "17.0784".toString();

  useEffect(() => {
    handleTradeStateReset();
  }, [marketId, chainId, handleTradeStateReset]);

  return (
    <Flex direction="column" width={"100%"}>
      <TradeHeader market={currentMarket} />
      <Flex direction="column" gap="20px">
        <Flex
          height={{ initial: "auto", sm: "561px" }}
          width={"100%"}
          direction={{ initial: "column-reverse", sm: "row" }}
          align={{ initial: "center", sm: "start" }}
          px={{ initial: "20px", sm: "0" }}
        >
          <Chart
            marketId={marketId}
            longPrice={longPrice.replaceAll(",", "")}
            shortPrice={shortPrice.replaceAll(",", "")}
          />
          <TradeWidget />
        </Flex>
        <Box>Positions</Box>
      </Flex>
    </Flex>
  );
};

export default Trade;
