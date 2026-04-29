import { Text } from "@radix-ui/themes";
import theme from "../../../theme";
import MarketsList from "./MarketsList";
import {
  MarketInfoContainer,
  StyledFlex,
  TradeHeaderContainer,
} from "./trade-header-styles";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useTradeState } from "../../../state/trade/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { limitDigitsInDecimals, toWei } from "overlay-sdk";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { TRADE_POLLING_INTERVAL } from "../../../constants/applications";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import { isGamblingMarket } from "../../../utils/marketGuards";
import { PredictionMarketGroup } from "../../../constants/markets";

interface TradeHeaderProps {
  predictionGroup?: PredictionMarketGroup;
}

const TradeHeader: React.FC<TradeHeaderProps> = ({ predictionGroup }) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");

  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, selectedLeverage, isLong } = useTradeState();

  const [currencyPrice, setCurrencyPrice] = useState<string>("-");
  const [funding, setFunding] = useState<string | undefined>(undefined);

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const isGambling = useMemo(
    () => isGamblingMarket(market?.marketName),
    [market?.marketName]
  );

  const hideMarketInfo = isGambling || !!predictionGroup;

  useEffect(() => {
    if (!marketId || hideMarketInfo) return;

    const fetchPrice = async () => {
      try {
        const price = await sdkRef.current.trade.getPrice(
          marketId,
          typedValue ? toWei(typedValue) : undefined,
          toWei(selectedLeverage),
          isLong,
          8
        );

        if (price) {
          const limited = limitDigitsInDecimals(price as string);

          if (market) {
            setCurrencyPrice(
              formatPriceWithCurrency(limited, market.priceCurrency)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, TRADE_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [marketId, typedValue, selectedLeverage, isLong, chainId, market, hideMarketInfo]);

  useEffect(() => {
    if (!marketId || hideMarketInfo) return;

    const fetchStaticMarketData = async () => {
      try {
        const [funding] = await Promise.all([
          sdkRef.current.trade.getFunding(marketId),
          sdkRef.current.trade.getOIBalance(marketId),
        ]);

        if (funding) setFunding(funding);
      } catch (error) {
        console.error("Error fetching static market data:", error);
      }
    };

    fetchStaticMarketData();
    const intervalId = setInterval(
      fetchStaticMarketData,
      TRADE_POLLING_INTERVAL
    );
    return () => clearInterval(intervalId);
  }, [marketId, chainId, hideMarketInfo]);

  const isFundingRatePositive = useMemo(() => {
    return Math.sign(Number(funding)) > 0;
  }, [funding]);

  return (
    <TradeHeaderContainer>
      <MarketsList predictionGroup={predictionGroup} />

      {!hideMarketInfo ? (
        <MarketInfoContainer>
          <StyledFlex width={{ initial: "149px", sm: "167px", lg: "149px" }}>
            <Text weight="light" style={{ fontSize: "10px" }}>
              Price
            </Text>
            <Text>{currencyPrice}</Text>
          </StyledFlex>

          <StyledFlex width={{ initial: "72px", sm: "167px", lg: "97px" }}>
            <Text weight="light" style={{ fontSize: "10px" }}>
              Funding
            </Text>
            <Text
              style={{
                color: isFundingRatePositive
                  ? theme.color.green2
                  : theme.color.red2,
              }}
            >
              {isFundingRatePositive ? `+` : ``}
              {funding ? `${funding}%` : `-`}
            </Text>
          </StyledFlex>
        </MarketInfoContainer>
      ) : null}
    </TradeHeaderContainer>
  );
};

export default TradeHeader;
