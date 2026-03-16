import { Flex } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTradeActionHandlers, useTradeState } from "../../state/trade/hooks";
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
import { isGamblingMarket, getMarketGroup, getGroupById } from "../../utils/marketGuards";
import { PredictionMarketGroup } from "../../constants/markets";
import PredictionGroupChart from "./PredictionGroupChart";

const Trade: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const marketParam = searchParams.get("market");
  const groupParam = searchParams.get("group");

  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const { currentMarket } = useCurrentMarketState();
  const { handleTradeStateReset, handlePositionSideSelect } = useTradeActionHandlers();
  const { isLong } = useTradeState();
  const { handleCurrentMarketSet } = useCurrentMarketActionHandlers();
  const { data: markets } = useActiveMarkets();
  const prevMarketRef = useRef<string | undefined>();

  // Store prices from PositionsTable to pass to Chart and TradeWidget
  // This eliminates duplicate bid/ask polling
  const [marketPrices, setMarketPrices] = useState<{ bid: bigint; ask: bigint; mid: bigint } | undefined>(undefined);

  const handlePricesUpdate = useCallback((prices: { bid: bigint; ask: bigint; mid: bigint } | undefined) => {
    setMarketPrices(prices);
  }, []);

  // Determine if we're in prediction group mode
  const predictionGroup = useMemo((): PredictionMarketGroup | undefined => {
    if (groupParam) {
      return getGroupById(groupParam);
    }
    if (marketParam) {
      return getMarketGroup(decodeURIComponent(marketParam));
    }
    return undefined;
  }, [groupParam, marketParam]);

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

  // Default to first market in group if group param set but no market param
  useEffect(() => {
    if (predictionGroup && !marketParam) {
      setSearchParams(
        { group: predictionGroup.groupId, market: predictionGroup.marketIds[0] },
        { replace: true }
      );
      return;
    }
    if (!marketParam && !groupParam) {
      setSearchParams({ market: DEFAULT_MARKET }, { replace: true });
    }
  }, [marketParam, groupParam, predictionGroup]);

  // Auto-add group param when navigating to a grouped market directly
  useEffect(() => {
    if (predictionGroup && marketParam && !groupParam) {
      setSearchParams(
        { group: predictionGroup.groupId, market: marketParam },
        { replace: true }
      );
    }
  }, [predictionGroup, marketParam, groupParam]);

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
      // Don't reset collateral when switching between outcomes in a prediction group
      if (!predictionGroup) {
        handleTradeStateReset();
      }
    }

    prevMarketRef.current = name;
  }, [currentMarket, chainId, predictionGroup]);

  const handleOutcomeSelect = useCallback(
    (marketId: string, newIsLong: boolean) => {
      const params: Record<string, string> = { market: marketId };
      if (predictionGroup) {
        params.group = predictionGroup.groupId;
      }
      setSearchParams(params, { replace: true });
      handlePositionSideSelect(newIsLong);
    },
    [predictionGroup, setSearchParams, handlePositionSideSelect]
  );

  return (
    <TradeContainer direction="column" width={"100%"} mb="100px">
      <TradeHeader predictionGroup={predictionGroup} />

      <Flex direction="column">
        <StyledFlex
          width={"100%"}
          direction={{ initial: "column", sm: "row" }}
          align={{ initial: "center", sm: "start" }}
          px={{ initial: "4px", sm: "0" }}
        >
          {currentMarket ? (
            <>
              {predictionGroup ? (
                <PredictionGroupChart group={predictionGroup} />
              ) : shouldRenderGamblingTimeline ? (
                <GamblingTimeline />
              ) : (
                <Chart prices={marketPrices} />
              )}
              <TradeWidget
                prices={marketPrices}
                predictionGroup={predictionGroup}
                selectedMarketId={marketParam}
                isLong={isLong}
                onOutcomeSelect={handleOutcomeSelect}
              />
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
        <PositionsTable
          onPricesUpdate={handlePricesUpdate}
          groupMarketIds={predictionGroup?.marketIds}
        />
        <InfoMarketSection />
        <SuggestedCards />
      </Flex>
    </TradeContainer>
  );
};

export default Trade;
