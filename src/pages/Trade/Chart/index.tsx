import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import useBidAndAsk from "../../../hooks/useBidAndAsk";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import useTradingViewChart from "./hooks/useTradingViewChart";
import usePriceLines from "./hooks/usePriceLines";
import  theme  from "../../../theme";
import { EntityId, IChartingLibraryWidget } from "../../../charting_library";

const TVChartContainer = styled.div`
  height: 258px;
  width: 100%;
  background-color: ${theme.color.background};

  @media (min-width: 640px) {
    height: 561px;
  }
  @media (min-width: 1536px) {
    height: 643px;
  }
`;

const Chart: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");

  const { chainId } = useMultichainContext();
  const { currentMarket: market } = useCurrentMarketState();

  const { bid, ask } = useBidAndAsk(marketId);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const containerRef =  useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const tvWidgetRef = useRef<IChartingLibraryWidget  | null>(null);
  const askLineRef = useRef<EntityId | null>(null);
  const bidLineRef = useRef<EntityId | null>(null);

  const [initialAsk, setInitialAsk] = useState<number | undefined>(undefined);
  const [initialBid, setInitialBid] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (initialAsk === undefined && initialBid === undefined && ask !== undefined && bid !== undefined) {
      setInitialAsk(ask);
      setInitialBid(bid);
    }
  }, [ask, bid, initialAsk, initialBid]);

  const {  isReady } = useTradingViewChart({
    containerRef,
    tvWidgetRef,
    askLineRef, bidLineRef,
    market,
    chainId,
    initialAsk,
    initialBid,
    isMobile
  });

  const { setAskLine, setBidLine} = usePriceLines(tvWidgetRef,  askLineRef, bidLineRef);

  useEffect(() => {
      return () => {
      if (tvWidgetRef.current) {
        try {
          isReady.current = false;
          tvWidgetRef.current.remove();
        } catch (error) {
          console.error("Error during chart cleanup:", error);
        } finally {
          tvWidgetRef.current = null;
          askLineRef.current = null;
          bidLineRef.current = null;
          setInitialAsk(undefined);
          setInitialBid(undefined);
        }
      }
    };
    }, [marketId, chainId]);

    useEffect(() => {
      if (!isReady.current || !tvWidgetRef.current) return;

      if (ask !== undefined) setAskLine(ask);
      if (bid !== undefined) setBidLine(bid);
    }, [ask, bid, setAskLine, setBidLine]);

  return <TVChartContainer ref={containerRef} />;
};

export default Chart;