import { useEffect, useRef, useCallback } from "react";
import Datafeed from "../chartDatafeed"; 
import { formatTimeUTC, formatDateUTC, priceFormatterFactory } from "../utils/formatters";
import { ChartingLibraryWidgetOptions, EntityId, IChartingLibraryWidget, ResolutionString, widget } from "../../../../charting_library";
import { Chain } from "viem";
import { getMarketChartUrl } from "../helpers";
import { LocalStorageSaveLoadAdapter } from "../utils/localStorageSaveLoadAdapter";
import { MarketDataParsed } from "../../../../types/marketTypes";
import usePriceLines from "./usePriceLines";

interface UseTradingViewOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  tvWidgetRef: React.MutableRefObject<IChartingLibraryWidget | null>;
  askLineRef: React.MutableRefObject<EntityId | null>;
  bidLineRef: React.MutableRefObject<EntityId | null>;
  market: MarketDataParsed | undefined;
  chainId?: number | Chain;
  initialAsk?: number;
  initialBid?: number;
  isMobile: boolean;
}

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

export default function useTradingViewChart(opts: UseTradingViewOptions) {
  const { containerRef, tvWidgetRef, askLineRef, bidLineRef, market, chainId, initialAsk, initialBid, isMobile } = opts;

  const isReady = useRef(false);

  const { setAskLine, setBidLine } = usePriceLines(tvWidgetRef, askLineRef, bidLineRef);

  const destroy = useCallback(() => {  
    if (tvWidgetRef.current) {
      try {
        tvWidgetRef.current.remove();
      } catch (err) {
        console.error("Error destroying TradingView widget:", err);
      } finally {
        tvWidgetRef.current = null; 
        askLineRef.current = null;
        bidLineRef.current = null;
        isReady.current = false;           
      }
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !market || !chainId || initialAsk === undefined || initialBid === undefined || isReady.current) {
      return;
    }

    const fractionDigitsAmount = Math.max(
      String((initialBid ?? 0) + ".").split(".")[1]?.length ?? 0,
      String((initialAsk ?? 0) + ".").split(".")[1]?.length ?? 0
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
      container: containerRef.current,
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
          format: (date) => formatTimeUTC(new Date(date)),
          formatLocal: () => {
            return "";
          },
        },
        dateFormatter: {
          format: (date) => formatDateUTC(new Date(date)),
          formatLocal: () => {
            return "";
          },
        },
        priceFormatterFactory: (symbolInfo) => priceFormatterFactory(symbolInfo, fractionDigitsAmount, market),
      },
    };

    try {
      const tvWidget = new widget(widgetOptions);
      tvWidgetRef.current = tvWidget;

      tvWidget.onChartReady(() => {
        isReady.current = true;

        // adjust price scale to fit initial ask/bid if provided
        try {
          const chart = tvWidget.activeChart();
          if (!chart) return;
          const priceScale = chart.getPanes()[0].getRightPriceScales()[0];
          const visible = priceScale.getVisiblePriceRange?.();
          if (visible && visible.from !== undefined && visible.to !== undefined) {
            const priceRangeDifference = visible.to - visible.from;
            const priceRangeDifferenceOffset = priceRangeDifference * 0.1;

            const offsetTop = (initialAsk !== undefined && initialAsk >= visible.to - priceRangeDifferenceOffset)
              ? initialAsk + priceRangeDifferenceOffset
              : undefined;

            const offsetBottom = (initialBid !== undefined && initialBid <= visible.from + priceRangeDifferenceOffset)
              ? initialBid - priceRangeDifferenceOffset
              : undefined;

            priceScale.setVisiblePriceRange({
              from: offsetBottom ?? visible.from,
              to: offsetTop ?? visible.to,
            });
          }

          // subscribe to interval changed to re-enable autoscale
          chart.onIntervalChanged().subscribe(null, () => {
            try {
              const priceScale = chart.getPanes()[0].getRightPriceScales()[0];
              priceScale.setAutoScale(true);
            } catch (e) {
              // ignore
            }
          });

          if (initialAsk !== undefined) {
            setAskLine(initialAsk);
          }
          if (initialBid !== undefined) {
            setBidLine(initialBid);
          }
        } catch (e) {
          // ignore non-fatal errors
        }
      });
    } catch (err) {
      console.error("Failed to initialize TradingView widget:", err);
    }

    return () => {
      destroy();
    };

  }, [containerRef, market, chainId, isMobile, initialAsk, initialBid, setAskLine, setBidLine]);

  return { isReady };
}