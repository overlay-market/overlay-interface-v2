import { useEffect, useRef, useState } from "react";
import {
  widget,
  ChartingLibraryWidgetOptions,
  ResolutionString,
  IChartingLibraryWidget,
  EntityId,
} from "../../../charting_library";
import * as React from "react";
import styled from "styled-components";
import Datafeed from "./chartDatafeed";
import moment from "moment";
import { getMarketChartUrl } from "./helpers";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useSearchParams } from "react-router-dom";
import theme from "../../../theme";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { LocalStorageSaveLoadAdapter } from "./utils/localStorageSaveLoadAdapter";
import useBidAndAsk from "../../../hooks/useBidAndAsk";

const TVChartContainer = styled.div`
  height: 258px;
  width: 100%;

  @media (min-width: ${theme.breakpoints.sm}) {
    height: 561px;
  }
  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 643px;
  }
`;

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];
  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
  theme: ChartingLibraryWidgetOptions["theme"];
}

const Chart: React.FC = () => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const { currentMarket: market } = useCurrentMarketState();

  const { bid, ask } = useBidAndAsk(marketId);

  const [initialLongPrice, setInitialLongPrice] = useState<number | undefined>(
    undefined
  );
  const [initialShortPrice, setInitialShortPrice] = useState<
    number | undefined
  >(undefined);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const longPriceLineRef = useRef<EntityId | null>(null);
  const shortPriceLineRef = useRef<EntityId | null>(null);
  const chartInitialized = useRef(false);

  const isCleaningUp = useRef(false);

  const updatePriceLines = React.useCallback(
    (newBid?: number, newAsk?: number) => {
      if (
        !tvWidgetRef.current ||
        !chartInitialized.current ||
        isCleaningUp.current
      ) {
        return;
      }

      try {
        const currentTime = Date.now() / 1000;
        const chart = tvWidgetRef.current.activeChart();

        if (!chart) {
          return;
        }

        if (newAsk !== undefined && longPriceLineRef.current) {
          const newLongPriceLine = chart.createMultipointShape(
            [{ time: currentTime, price: newAsk }],
            {
              shape: "horizontal_line",
              lock: true,
              disableSelection: true,
              disableSave: true,
              disableUndo: true,
              filled: false,
              zOrder: "top",
              overrides: {
                linecolor: "#089981",
                linewidth: 1,
                text: "ask",
                showLabel: true,
                textcolor: "#089981",
                horzLabelsAlign: "right",
                vertLabelsAlign: "bottom",
              },
            }
          );

          if (newLongPriceLine) {
            chart.removeEntity(longPriceLineRef.current);
            longPriceLineRef.current = newLongPriceLine as EntityId;
          }
        }

        if (newBid !== undefined && shortPriceLineRef.current) {
          const newShortPriceLine = chart.createMultipointShape(
            [{ time: currentTime, price: newBid }],
            {
              shape: "horizontal_line",
              lock: true,
              disableSelection: true,
              disableSave: true,
              disableUndo: true,
              filled: false,
              zOrder: "top",
              overrides: {
                linecolor: "#f23645",
                linewidth: 1,
                textcolor: "#f23645",
                text: "bid",
                showLabel: true,
                horzLabelsAlign: "right",
                vertLabelsAlign: "top",
              },
            }
          );

          if (newShortPriceLine) {
            chart.removeEntity(shortPriceLineRef.current);
            shortPriceLineRef.current = newShortPriceLine as EntityId;
          }
        }
      } catch (error) {
        console.error("Error updating price lines:", error);
      }
    },
    []
  );

  useEffect(() => {
    setInitialLongPrice(undefined);
    setInitialShortPrice(undefined);
    chartInitialized.current = false;
    isCleaningUp.current = true;

    if (tvWidgetRef.current) {
      try {
        tvWidgetRef.current.remove();
      } catch (error) {
        console.error("Error removing TradingView widget:", error);
      } finally {
        tvWidgetRef.current = null;
        longPriceLineRef.current = null;
        shortPriceLineRef.current = null;
      }
    }

    const timer = setTimeout(() => {
      isCleaningUp.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, [marketId, chainId]);

  useEffect(() => {
    if (
      !isCleaningUp.current &&
      initialLongPrice === undefined &&
      initialShortPrice === undefined &&
      ask !== undefined &&
      bid !== undefined
    ) {
      setInitialLongPrice(ask);
      setInitialShortPrice(bid);
    }
  }, [ask, bid, initialLongPrice, initialShortPrice]);

  useEffect(() => {
    if (
      market &&
      initialLongPrice !== undefined &&
      initialShortPrice !== undefined &&
      chainId !== undefined &&
      !chartInitialized.current &&
      !isCleaningUp.current
    ) {
      const fractionDigitsAmount = Math.max(
        String(initialShortPrice + ". ").split(".")[1].length,
        String(initialLongPrice + ". ").split(".")[1].length
      );

      const defaultProps: Omit<ChartContainerProps, "container"> = {
        symbol: JSON.stringify({
          marketAddress: market.id,
          description: market.marketName,
          chainId: chainId,
        }),
        interval: "60" as ResolutionString,
        userId: "public_user_id_paul",
        datafeedUrl: getMarketChartUrl(chainId),
        libraryPath: "/charting_library/",
        chartsStorageUrl: "https://saveload.tradingview.com",
        chartsStorageApiVersion: "1.1",
        clientId: "tradingview.com",
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
        theme: "dark",
      };

      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: defaultProps.symbol as string,
        datafeed: Datafeed,
        library_path: defaultProps.libraryPath as string,
        interval:
          defaultProps.interval as ChartingLibraryWidgetOptions["interval"],
        container: chartContainerRef.current,
        locale: "en",
        save_load_adapter: new LocalStorageSaveLoadAdapter(market.marketName),
        enabled_features: ["study_templates"],
        disabled_features: isMobile
          ? [
              "left_toolbar",
              "control_bar",
              "timeframes_toolbar",
              "header_symbol_search",
              "symbol_search_hot_key",
              "header_compare",
            ]
          : ["header_symbol_search", "symbol_search_hot_key", "header_compare"],
        charts_storage_api_version: defaultProps.chartsStorageApiVersion,
        client_id: defaultProps.clientId,
        user_id: defaultProps.userId,
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        studies_overrides: defaultProps.studiesOverrides,
        theme: defaultProps.theme,
        header_widget_buttons_mode: "fullsize",
        overrides: {
          "mainSeriesProperties.showPriceLine": false,
          "scalesProperties.showSeriesLastValue": false,
        },
        custom_formatters: {
          timeFormatter: {
            format: (date) => {
              return moment.utc(date).format("HH:mm");
            },
            formatLocal: () => {
              return "";
            },
          },
          dateFormatter: {
            format: (date) => {
              return moment.utc(date).format("DD MMM `YY");
            },
            formatLocal: () => {
              return "";
            },
          },
          priceFormatterFactory: (symbolInfo) => {
            if (symbolInfo === null) {
              return null;
            }
            const marketFormattingPrice = ["BTC / USD", "ETH / USD"];
            const marketName = market?.marketName || "";
            if (marketFormattingPrice.some((name) => marketName === name)) {
              return {
                format: (price: number) => {
                  return Math.round(price).toString();
                },
              };
            }
            if (symbolInfo.format === "volume") {
              return {
                format: (price) => {
                  if (price >= 1000000000) {
                    return `${(price / 1000000000).toFixed(3)}B`;
                  }
                  if (price >= 1000000) {
                    return `${(price / 1000000).toFixed(3)}M`;
                  }
                  if (price >= 1000) {
                    return `${(price / 1000).toFixed(3)}K`;
                  }
                  if (price >= 1 && price < 10) {
                    return price.toFixed(fractionDigitsAmount);
                  }
                  if (price < 1) {
                    if (market.priceCurrency === "%") {
                      return (price * 100).toFixed(2);
                    } else {
                      return price.toFixed(fractionDigitsAmount);
                    }
                  }
                  return price.toFixed(2);
                },
              };
            }
            return null; // The default formatter will be used.
          },
        },
      };

      const tvWidget = new widget(widgetOptions);
      tvWidgetRef.current = tvWidget;
      chartInitialized.current = true;

      tvWidget.onChartReady(function () {
        if (isCleaningUp.current) {
          return;
        }

        const currentTime = Date.now() / 1000;
        const priceScale = tvWidget
          .activeChart()
          .getPanes()[0]
          .getRightPriceScales()[0];
        const priceRangeFrom = priceScale.getVisiblePriceRange()?.from;
        const priceRangeTo = priceScale.getVisiblePriceRange()?.to;

        if (priceRangeFrom && priceRangeTo) {
          const priceRangeDifference = priceRangeTo - priceRangeFrom;
          const priceRangeDifferenceOffset = priceRangeDifference * 0.1;

          const offsetTop =
            initialLongPrice >= priceRangeTo - priceRangeDifferenceOffset
              ? initialLongPrice + priceRangeDifferenceOffset
              : null;
          const offsetBottom =
            initialShortPrice <= priceRangeFrom + priceRangeDifferenceOffset
              ? initialShortPrice - priceRangeDifferenceOffset
              : null;

          priceScale.setVisiblePriceRange({
            from: offsetBottom ? offsetBottom : priceRangeFrom,
            to: offsetTop ? offsetTop : priceRangeTo,
          });
        }

        tvWidget
          .activeChart()
          .onIntervalChanged()
          .subscribe(null, () => {
            priceScale.setAutoScale(true);
          });

        const longPriceLine = tvWidget
          .activeChart()
          .createMultipointShape(
            [{ time: currentTime, price: initialLongPrice }],
            {
              shape: "horizontal_line",
              lock: true,
              disableSelection: true,
              disableSave: true,
              disableUndo: true,
              filled: false,
              zOrder: "top",
              overrides: {
                linecolor: "#089981",
                linewidth: 1,
                text: "ask",
                showLabel: true,
                textcolor: "#089981",
                horzLabelsAlign: "right",
                vertLabelsAlign: "bottom",
              },
            }
          );
        longPriceLineRef.current = longPriceLine;

        const shortPriceLine = tvWidget
          .activeChart()
          .createMultipointShape(
            [{ time: currentTime, price: initialShortPrice }],
            {
              shape: "horizontal_line",
              lock: true,
              disableSelection: true,
              disableSave: true,
              disableUndo: true,
              filled: false,
              zOrder: "top",
              overrides: {
                linecolor: "#f23645",
                linewidth: 1,
                textcolor: "#f23645",
                text: "bid",
                showLabel: true,
                horzLabelsAlign: "right",
                vertLabelsAlign: "top",
              },
            }
          );
        shortPriceLineRef.current = shortPriceLine;
      });

      return () => {
        if (tvWidget && !isCleaningUp.current) {
          try {
            tvWidget.remove();
          } catch (error) {
            console.error("Error in cleanup function:", error);
          }
        }
      };
    }
  }, [market, chainId, initialLongPrice, initialShortPrice, isMobile]);

  useEffect(() => {
    if (
      chartInitialized.current &&
      !isCleaningUp.current &&
      tvWidgetRef.current &&
      (bid !== undefined || ask !== undefined)
    ) {
      updatePriceLines(bid, ask);
    }
  }, [bid, ask, updatePriceLines]);

  return <TVChartContainer ref={chartContainerRef} />;
};

export default Chart;
