import { Flex } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect, useRef, useState } from "react";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import Chart from "./Chart";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSDK from "../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
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
import { DEFAULT_MARKET } from "../../constants/applications";
import { deepEqual } from "../../utils/equalityUtils";

const Trade: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const marketParam = searchParams.get("market");

  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const { currentMarket } = useCurrentMarketState();
  const { handleTradeStateReset } = useTradeActionHandlers();
  const { handleCurrentMarketSet } = useCurrentMarketActionHandlers();
  const { handleMarketsUpdate } = useMarketsActionHandlers();

  const [markets, setMarkets] = useState<ExpandedMarketData[] | undefined>(
    undefined
  );

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  useEffect(() => {
    if (!marketParam) {
      setSearchParams({ market: DEFAULT_MARKET }, { replace: true });
    }
  }, [marketParam]);

  useEffect(() => {
    let isFetching = false;

    const fetchActiveMarkets = async () => {
      if (!sdkRef.current.markets.getActiveMarkets || isFetching) return;
      isFetching = true;
      try {
        const activeMarkets = await sdkRef.current.markets.getActiveMarkets();
        activeMarkets &&
          setMarkets((prev) =>
            deepEqual(prev, activeMarkets) ? prev : activeMarkets
          );
      } catch (error) {
        console.error("Error fetching markets:", error);
      } finally {
        isFetching = false;
      }
    };

    fetchActiveMarkets();
  }, [chainId]);

  useEffect(() => {
    if (!markets || !marketParam) return;

    if (markets && marketParam) {
      const normalizedMarketParam =
        decodeURIComponent(marketParam).toLowerCase();

      const currentMarket = markets.find(
        (market) => market.marketName.toLowerCase() === normalizedMarketParam
      );

      if (currentMarket) {
        handleCurrentMarketSet(currentMarket);
      } else {
        const activeMarket = markets[0];
        handleCurrentMarketSet(activeMarket);

        const encodedMarket = encodeURIComponent(activeMarket.marketName);
        navigate(`/trade?market=${encodedMarket}`, { replace: true });
      }
    }
  }, [marketParam, markets]);

  useEffect(() => {
    if (markets) {
      handleMarketsUpdate(markets);
    }
  }, [markets]);

  useEffect(() => {
    handleTradeStateReset();
  }, [marketParam, chainId, handleTradeStateReset]);

  return (
    <TradeContainer direction="column" width={"100%"} mb="100px">
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
