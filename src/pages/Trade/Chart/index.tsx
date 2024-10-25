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
import useSDK from "../../../hooks/useSDK";
import { useParams } from "react-router-dom";
import { limitDigitsInDecimals } from "overlay-sdk";
import { TRADE_POLLING_INTERVAL } from "../../../constants/applications";

const TVChartContainer = styled.div`
  height: 561px;
  width: 100%;
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
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const { currentMarket: market } = useCurrentMarketState();

  const [ask, setAsk] = useState<number | undefined>(undefined);
  const [bid, setBid] = useState<number | undefined>(undefined);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchBidAndAsk = async () => {
      if (marketId) {
        try {
          const bidAndAsk = await sdk.trade.getBidAndAsk(marketId, 8);

          const ask =
            bidAndAsk &&
            limitDigitsInDecimals(bidAndAsk.ask as number).replaceAll(",", "");
          const bid =
            bidAndAsk &&
            limitDigitsInDecimals(bidAndAsk.bid as number).replaceAll(",", "");

          setAsk(Number(ask));
          setBid(Number(bid));
        } catch (error) {
          console.error("Error fetching bid and ask:", error);
        }
      }
    };

    fetchBidAndAsk();
    interval = setInterval(fetchBidAndAsk, TRADE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [marketId, chainId, sdk]);

  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const longPriceLineRef = useRef<EntityId | null>(null);
  const shortPriceLineRef = useRef<EntityId | null>(null);

  useEffect(() => {
    if (market && ask && bid && chainId !== undefined) {
      const fractionDigitsAmount = Math.max(
        String(bid + ". ").split(".")[1].length,
        String(ask + ". ").split(".")[1].length
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
        disabled_features: [
          "use_localstorage_for_settings",
          "left_toolbar",
          "control_bar",
          "timeframes_toolbar",
          "header_symbol_search",
          "symbol_search_hot_key",
          "header_compare",
        ],
        charts_storage_url: defaultProps.chartsStorageUrl,
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

      tvWidget.onChartReady(function () {
        const currentTime = Date.now() / 1000;
        const priceScale = tvWidget
          .activeChart()
          .getPanes()[0]
          .getRightPriceScales()[0];
        const priceRangeFrom = priceScale.getVisiblePriceRange()?.from;
        const priceRangeTo = priceScale.getVisiblePriceRange()?.to;

        //check if bid/ask prices are outside the price range
        //if so, set new values for boundaries
        if (priceRangeFrom && priceRangeTo) {
          const priceRangeDifference = priceRangeTo - priceRangeFrom;
          const priceRangeDifferenceOffset = priceRangeDifference * 0.1;

          const offsetTop =
            ask >= priceRangeTo - priceRangeDifferenceOffset
              ? ask + priceRangeDifferenceOffset
              : null;
          const offsetBottom =
            bid <= priceRangeFrom + priceRangeDifferenceOffset
              ? bid - priceRangeDifferenceOffset
              : null;

          priceScale.setVisiblePriceRange({
            from: offsetBottom ? offsetBottom : priceRangeFrom,
            to: offsetTop ? offsetTop : priceRangeTo,
          });
        }

        //add horizontal line with long Price
        const longPriceLine = tvWidget
          .activeChart()
          .createMultipointShape([{ time: currentTime, price: ask }], {
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
          });
        longPriceLineRef.current = longPriceLine;

        //add horizontal line with short Price
        const shortPriceLine = tvWidget
          .activeChart()
          .createMultipointShape([{ time: currentTime, price: bid }], {
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
          });
        shortPriceLineRef.current = shortPriceLine;
      });

      return () => {
        tvWidget.remove();
      };
    }
  }, [market, chainId, ask, bid]);

  // Effect to update the longPrice shape
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateLongPriceShape = () => {
      if (tvWidgetRef.current && longPriceLineRef.current && ask) {
        const currentTime = Date.now() / 1000;
        const chart = tvWidgetRef.current?.activeChart();

        chart.removeEntity(longPriceLineRef.current);

        const newLongPriceLine = chart.createMultipointShape(
          [{ time: currentTime, price: ask }],
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

        longPriceLineRef.current = newLongPriceLine as EntityId;
      }
    };

    interval = setInterval(updateLongPriceShape, TRADE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [ask]);

  // Effect to update the shortPrice shape
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateShortPriceShape = () => {
      if (tvWidgetRef.current && shortPriceLineRef.current && bid) {
        const currentTime = Date.now() / 1000;
        const chart = tvWidgetRef.current?.activeChart();

        chart.removeEntity(shortPriceLineRef.current);

        const newShortPriceLine = chart.createMultipointShape(
          [{ time: currentTime, price: bid }],
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
        shortPriceLineRef.current = newShortPriceLine;
      }
    };

    interval = setInterval(updateShortPriceShape, TRADE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [bid]);

  return <TVChartContainer ref={chartContainerRef} />;
};

export default Chart;