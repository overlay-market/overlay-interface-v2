import MarketsList from "./MarketsList";
import {
  HeaderMetric,
  HeaderPriceBlock,
  LastPrice,
  MarketInfoContainer,
  MetricLabel,
  MetricValue,
  PriceChange,
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
import {
  formatNumberWithCommas,
  formatPriceWithCurrency,
} from "../../../utils/formatPriceWithCurrency";
import { isGamblingMarket } from "../../../utils/marketGuards";
import { PredictionMarketGroup } from "../../../constants/markets";
import { useMarkets7d } from "../../../hooks/useMarkets7d";

interface TradeHeaderProps {
  predictionGroup?: PredictionMarketGroup;
}

const UNAVAILABLE_HEADER_METRIC = "LOREM IPSUM"; // TODO: Replace when the market data API exposes exact 24h high, low, and turnover fields.

const formatHeaderPrice = (
  value?: string | number,
  priceCurrency: string = "$"
) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return "-";

  if (priceCurrency === "%") {
    return formatPriceWithCurrency(numericValue, priceCurrency);
  }

  return formatNumberWithCommas(numericValue);
};

const formatSignedChange = (
  latestPrice?: number,
  twentyFourHourChange?: number,
  priceCurrency: string = "$"
) => {
  if (
    !Number.isFinite(latestPrice) ||
    !Number.isFinite(twentyFourHourChange)
  ) {
    return "-";
  }

  const previousPrice =
    (latestPrice as number) / (1 + (twentyFourHourChange as number) / 100);
  const absoluteChange = (latestPrice as number) - previousPrice;
  const sign = absoluteChange >= 0 ? "+" : "";
  const formattedAbsolute = formatPriceWithCurrency(
    Math.abs(absoluteChange),
    priceCurrency
  );

  return `${sign}${formattedAbsolute} (${sign}${(twentyFourHourChange as number).toFixed(2)}%)`;
};

const formatFundingCountdown = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${secs}`;
};

const getFundingCountdownSeconds = () => {
  const now = new Date();
  const elapsedSeconds =
    (now.getUTCHours() % 8) * 3600 +
    now.getUTCMinutes() * 60 +
    now.getUTCSeconds();
  return 8 * 3600 - elapsedSeconds;
};

const formatOpenInterest = (longOi?: string, shortOi?: string) => {
  const openInterest = Number(longOi ?? 0) + Number(shortOi ?? 0);
  if (!Number.isFinite(openInterest) || openInterest <= 0) return "-";
  return formatNumberWithCommas(openInterest);
};

const TradeHeader: React.FC<TradeHeaderProps> = ({ predictionGroup }) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");

  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, selectedLeverage, isLong } = useTradeState();

  const [currencyPrice, setCurrencyPrice] = useState<string>("-");
  const [funding, setFunding] = useState<string | undefined>(undefined);
  const [fundingCountdownSeconds, setFundingCountdownSeconds] = useState(
    getFundingCountdownSeconds
  );

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const isGambling = useMemo(
    () => isGamblingMarket(market?.marketName),
    [market?.marketName]
  );

  const hideMarketInfo = isGambling || !!predictionGroup;
  const marketOverviewIds = useMemo(
    () => (market?.marketId ? [market.marketId] : []),
    [market?.marketId]
  );
  const marketOverview = useMarkets7d(marketOverviewIds)[0];

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFundingCountdownSeconds(getFundingCountdownSeconds());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const isPriceChangePositive = (marketOverview?.twentyFourHourChange ?? 0) >= 0;
  const displayLastPrice = formatHeaderPrice(
    currencyPrice !== "-" ? currencyPrice.replace(/[^0-9.-]/g, "") : market?.parsedMid,
    market?.priceCurrency
  );
  const markPrice = formatHeaderPrice(
    currencyPrice !== "-" ? currencyPrice.replace(/[^0-9.-]/g, "") : market?.parsedMid,
    market?.priceCurrency
  );
  const indexPrice = formatHeaderPrice(
    marketOverview?.latestPrice ?? market?.parsedMid,
    market?.priceCurrency
  );
  const priceChangeLabel = formatSignedChange(
    marketOverview?.latestPrice,
    marketOverview?.twentyFourHourChange,
    market?.priceCurrency
  );
  const fundingLabel = `${isFundingRatePositive ? "+" : ""}${funding ? `${funding}%` : "-"} / ${formatFundingCountdown(fundingCountdownSeconds)}`;
  const openInterestLabel = formatOpenInterest(
    market?.parsedOiLong,
    market?.parsedOiShort
  );

  return (
    <TradeHeaderContainer>
      <MarketsList predictionGroup={predictionGroup} />

      {!hideMarketInfo ? (
        <MarketInfoContainer>
          <HeaderPriceBlock>
            <LastPrice $positive={isPriceChangePositive}>
              {displayLastPrice}
            </LastPrice>
            <PriceChange $positive={isPriceChangePositive}>
              {priceChangeLabel}
            </PriceChange>
          </HeaderPriceBlock>

          <HeaderMetric>
            <MetricLabel>Mark Price</MetricLabel>
            <MetricValue>{markPrice}</MetricValue>
          </HeaderMetric>

          <HeaderMetric>
            <MetricLabel>Index Price</MetricLabel>
            <MetricValue>{indexPrice}</MetricValue>
          </HeaderMetric>

          <HeaderMetric $wide>
            <MetricLabel>Funding Rate/Countdown</MetricLabel>
            <MetricValue $tone={isFundingRatePositive ? "positive" : "negative"}>
              {fundingLabel}
            </MetricValue>
          </HeaderMetric>

          <HeaderMetric>
            <MetricLabel>24h High</MetricLabel>
            <MetricValue>{UNAVAILABLE_HEADER_METRIC}</MetricValue>
          </HeaderMetric>

          <HeaderMetric>
            <MetricLabel>24h Low</MetricLabel>
            <MetricValue>{UNAVAILABLE_HEADER_METRIC}</MetricValue>
          </HeaderMetric>

          <HeaderMetric $wide>
            <MetricLabel>24h Turnover (USDT)</MetricLabel>
            <MetricValue>{UNAVAILABLE_HEADER_METRIC}</MetricValue>
          </HeaderMetric>

          <HeaderMetric $wide>
            <MetricLabel>Open Interest (OVL)</MetricLabel>
            <MetricValue>{openInterestLabel}</MetricValue>
          </HeaderMetric>
        </MarketInfoContainer>
      ) : null}
    </TradeHeaderContainer>
  );
};

export default TradeHeader;
