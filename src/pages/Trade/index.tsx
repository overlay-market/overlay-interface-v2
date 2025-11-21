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
import useActiveMarkets from "../../hooks/useActiveMarkets";
import GamblingTimeline from "./Chart/GamblingTimeline";
import { isGamblingMarket } from "../../utils/marketGuards";

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
  const prevMarketRef = useRef<string | undefined>();

  const shouldRenderGamblingTimeline = useMemo(() => {
    if (!currentMarket) {
      return false;
    }

    return isGamblingMarket(currentMarket.marketName);
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

    const normalized = decodeURIComponent(marketParam).toLowerCase();

    const selected = markets.find(
      (m) => m.marketName.toLowerCase() === normalized
    );

    if (selected) {
      handleCurrentMarketSet(selected);
      return;
    }

    const fallback = markets[0];
    handleCurrentMarketSet(fallback);
    navigate(`/trade?market=${encodeURIComponent(fallback.marketName)}`, {
      replace: true,
    });
  }, [marketParam, markets]);

  useEffect(() => {
    if (!currentMarket) return;

    const name = currentMarket.marketName;
    if (prevMarketRef.current !== name) {
      handleTradeStateReset();
    }

    prevMarketRef.current = name;
  }, [currentMarket, chainId]);

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
              {shouldRenderGamblingTimeline ? <GamblingTimeline /> : <Chart />}
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
