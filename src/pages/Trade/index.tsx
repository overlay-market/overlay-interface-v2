import { Flex } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect, useState } from "react";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import Chart from "./Chart";
import { useNavigate, useParams } from "react-router-dom";
import useSDK from "../../providers/SDKProvider/useSDK";
import Loader from "../../components/Loader";
import {
  useCurrentMarketActionHandlers,
  useCurrentMarketState,
} from "../../state/currentMarket/hooks";
import { useMarketsActionHandlers } from "../../state/markets/hooks";
import PositionsTable from "./PositionsTable";
import InfoMarketSection from "./InfoMarketSection";
import { ExpandedMarketData } from "overlay-sdk";
import { StyledFlex, TradeContainer } from "./trade-styles";
import SuggestedCards from "./SuggestedCards";

const Trade: React.FC = () => {
  const { marketId } = useParams();
  const sdk = useSDK();
  const navigate = useNavigate();
  const { currentMarket } = useCurrentMarketState();
  const { handleTradeStateReset } = useTradeActionHandlers();
  const { handleCurrentMarketSet } = useCurrentMarketActionHandlers();
  const { handleMarketsUpdate } = useMarketsActionHandlers();

  const [markets, setMarkets] = useState<ExpandedMarketData[] | undefined>(
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
  }, []);

  useEffect(() => {
    if (markets) {
      const currentMarket = markets.find(
        (market) => market.marketName === marketId
      );

      if (currentMarket) {
        handleCurrentMarketSet(currentMarket);
      } else {
        const activeMarket = markets[0];
        handleCurrentMarketSet(activeMarket);
        navigate(`/trade/${activeMarket.marketId}`);
      }
    }
  }, [marketId, markets]);

  useEffect(() => {
    if (markets) {
      handleMarketsUpdate(markets);
    }
  }, [markets]);

  useEffect(() => {
    handleTradeStateReset();
  }, [marketId, handleTradeStateReset]);

  return (
    <TradeContainer direction="column" mb="100px">
      <TradeHeader />

      <Flex direction="column">
        <StyledFlex
          height={{ initial: "auto", sm: "561px" }}
          width={"100%"}
          direction={{ initial: "column", sm: "row" }}
          align={{ initial: "center", sm: "start" }}
          px={{ initial: "4px", sm: "0" }}
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
        </StyledFlex>
        <PositionsTable />
        <InfoMarketSection />
        <SuggestedCards />
      </Flex>
    </TradeContainer>
  );
};

export default Trade;
