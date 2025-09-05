import { Flex } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect, useRef } from "react";
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
import { DEFAULT_LOGO, MARKETS_FULL_LOGOS } from "../../constants/markets";

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

  useEffect(() => {
    const marketId = currentMarket?.marketId;
    const marketName = currentMarket?.marketName;
    const imageSrc =
      (marketId && MARKETS_FULL_LOGOS[marketId]) || DEFAULT_LOGO;

    const title = marketName
      ? `${marketName} | Overlay Markets`
      : "Overlay Markets";
    const description = marketName
      ? `Trade ${marketName} on Overlay Markets`
      : "Trade markets on Overlay Markets";

    document.title = title;

    const upsert = (
      attr: "name" | "property",
      key: string,
      value: string
    ) => {
      let element = document.head.querySelector(
        `meta[${attr}="${key}"]`
      ) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    upsert("property", "og:type", "website");
    upsert("property", "og:title", title);
    upsert("property", "og:description", description);
    upsert("property", "og:image", imageSrc);
    upsert("name", "twitter:card", "summary_large_image");
    upsert("name", "twitter:title", title);
    upsert("name", "twitter:description", description);
    upsert("name", "twitter:image", imageSrc);
  }, [currentMarket]);

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
