import { Flex } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect, useMemo, useRef } from "react";
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
import PositionsTable from "./PositionsTable";
import InfoMarketSection from "./InfoMarketSection";
import { StyledFlex, TradeContainer } from "./trade-styles";
import SuggestedCards from "./SuggestedCards";
import { DEFAULT_MARKET } from "../../constants/applications";
import { MARKETS_WITH_GAMBLING_TIMELINE } from "../../constants/markets";
import useActiveMarkets from "../../hooks/useActiveMarkets";
import GamblingTimeline from "./Chart/GamblingTimeline";

const Trade: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const marketParam = searchParams.get("market");

  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const { currentMarket } = useCurrentMarketState();
  const { handleTradeStateReset } = useTradeActionHandlers();
  const { handleCurrentMarketSet } = useCurrentMarketActionHandlers();
  const { data: markets } = useActiveMarkets();
  const shouldRenderGamblingTimeline = useMemo(() => {
    if (!currentMarket) {
      return false;
    }

    const encodedMarketName = encodeURIComponent(currentMarket.marketName);
    return MARKETS_WITH_GAMBLING_TIMELINE.includes(encodedMarketName);
  }, [currentMarket]);

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
              {shouldRenderGamblingTimeline ? (
                <GamblingTimeline />
              ) : (
                <Chart />
              )}
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
