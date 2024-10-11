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
import Loader from "../../components/Loader";

export const limitDigitsInDecimals = (
  input: string | number | null | undefined,
  sigFig: number = 4
) => {
  if (Number(input) < 1) {
    return Number(input).toLocaleString("en-US", {
      maximumSignificantDigits: sigFig,
      minimumSignificantDigits: sigFig,
    });
  } else {
    return Number(input).toLocaleString("en-US", {
      maximumFractionDigits: sigFig,
      minimumFractionDigits: sigFig,
    });
  }
};

const Trade: React.FC = () => {
  const { handleTradeStateReset } = useTradeActionHandlers();
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const [markets, setMarkets] = useState<MarketData[] | undefined>(undefined);
  const [currentMarket, setCurrentMarket] = useState<MarketData | undefined>(
    undefined
  );

  const [longPrice, setLongPrice] = useState<string>("");
  const [shortPrice, setShortPrice] = useState<string>("");

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

  useEffect(() => {
    if (currentMarket) {
      setLongPrice(currentMarket.parsedAsk);
      setShortPrice(currentMarket.parsedBid);
    }
  }, [currentMarket]);

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
          {currentMarket ? (
            <>
              <Chart
                marketAddress={currentMarket?.id}
                marketName={currentMarket?.marketName}
                longPrice={longPrice.replaceAll(",", "")}
                shortPrice={shortPrice.replaceAll(",", "")}
              />
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
        <Box>Positions</Box>
      </Flex>
    </Flex>
  );
};

export default Trade;
