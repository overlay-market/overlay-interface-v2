import React, { useEffect, useMemo, useState } from "react";
import { gql, request } from "graphql-request";
import { formatUnits } from "viem";
import styled from "styled-components";
import theme from "../../theme";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";
import { CHAIN_SUBGRAPH_URL } from "../../constants/subgraph";
import useSDK from "../../providers/SDKProvider/useSDK";
import { formatNumberWithCommas } from "../../utils/formatPriceWithCurrency";
import { formatPriceByCurrency } from "../../utils/formatPriceByCurrency";
import { useOvlPrice } from "../../hooks/useOvlPrice";

const TRADE_HISTORY_QUERY = gql`
  query TradeHistory($marketId: String!) {
    builds(
      where: { position_: { market: $marketId } }
      first: 100
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      price
      position {
        initialNotional
        isLong
      }
    }
    unwinds(
      where: { position_: { market: $marketId } }
      first: 100
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      price
      size
      position {
        isLong
      }
    }
    liquidates(
      where: { position_: { market: $marketId } }
      first: 100
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      price
      size
      position {
        isLong
      }
    }
  }
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 420px;
  background: #08090a;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 44px;
  padding: 0 14px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
`;

const TabTitle = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid ${theme.semantic.textPrimary};
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 700;
`;

const TradeHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 0.78fr 1fr 1fr;
  gap: 8px;
  padding: 14px 14px 8px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
`;

const TradeRows = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: ${theme.semantic.border} transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.semantic.border};
  }
`;

const TradeRow = styled.div`
  display: grid;
  grid-template-columns: 0.78fr 1fr 1fr;
  gap: 8px;
  min-height: 22px;
  padding: 2px 14px;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  line-height: 18px;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const TradePrice = styled.span<{ $tone: TradeHistoryTone }>`
  color: ${({ $tone }) =>
    $tone === "positive" ? theme.semantic.positive : theme.semantic.negative};
  font-weight: 700;
`;

const TradeAmount = styled.span`
  color: ${theme.semantic.textPrimary};
  text-align: right;
`;

const TradeEmpty = styled.div`
  padding: 18px 14px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
`;

type OrderBookPanelProps = {
  prices?: { bid: bigint; ask: bigint; mid: bigint };
};

type TradeHistoryType = "build" | "unwind" | "liquidate";
type TradeHistoryTone = "positive" | "negative";

type BuildTrade = {
  timestamp: string;
  price: string;
  position?: {
    initialNotional?: string;
    isLong?: boolean;
  } | null;
};

type UnwindTrade = {
  timestamp: string;
  price: string;
  size: string;
  position?: {
    isLong?: boolean;
  } | null;
};

type TradeHistoryResponse = {
  builds: BuildTrade[];
  unwinds: UnwindTrade[];
  liquidates: UnwindTrade[];
};

type TradeHistoryEntry = {
  id: string;
  type: TradeHistoryType;
  timestamp: number;
  price: string;
  amountOvl: string;
  tone: TradeHistoryTone;
};

const TRADE_HISTORY_PRICE_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace when a subgraph trade price cannot be parsed.
const TRADE_HISTORY_AMOUNT_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace when the OVL/USD price feed is unavailable.

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const formatUsdAmount = (amountOvl: string, ovlPrice?: number) => {
  if (!ovlPrice) return TRADE_HISTORY_AMOUNT_PLACEHOLDER;

  try {
    const amount = Number(formatUnits(BigInt(amountOvl), 18)) * ovlPrice;
    if (!Number.isFinite(amount)) return TRADE_HISTORY_AMOUNT_PLACEHOLDER;
    return formatNumberWithCommas(amount);
  } catch {
    return TRADE_HISTORY_AMOUNT_PLACEHOLDER;
  }
};

const formatTradePrice = (price: string, priceCurrency?: string) => {
  try {
    return formatPriceByCurrency(
      formatUnits(BigInt(price), 18),
      priceCurrency ?? "$"
    );
  } catch {
    return TRADE_HISTORY_PRICE_PLACEHOLDER;
  }
};

const getPriceLabel = (priceCurrency?: string) => {
  if (!priceCurrency || priceCurrency === "$") return "USD";
  return priceCurrency;
};

const getTradeHistoryTone = (
  type: TradeHistoryType,
  isLong?: boolean
): TradeHistoryTone => {
  if (isLong === undefined) {
    return type === "build" ? "positive" : "negative";
  }

  return (type === "build" && isLong) || (type !== "build" && !isLong)
    ? "positive"
    : "negative";
};

const OrderBookPanel: React.FC<OrderBookPanelProps> = () => {
  const { currentMarket } = useCurrentMarketState();
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];
  const { data: ovlPrice } = useOvlPrice();
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryEntry[]>([]);
  const [tradeHistoryLoading, setTradeHistoryLoading] = useState(false);
  const [tradeHistoryError, setTradeHistoryError] = useState(false);
  const marketAddress = currentMarket?.id?.toLowerCase();

  useEffect(() => {
    if (!marketAddress || !subgraphUrl) {
      setTradeHistory([]);
      return;
    }

    let cancelled = false;

    const fetchTradeHistory = async () => {
      setTradeHistoryLoading(true);
      setTradeHistoryError(false);

      try {
        const data = await request<TradeHistoryResponse>(
          subgraphUrl,
          TRADE_HISTORY_QUERY,
          { marketId: marketAddress }
        );

        if (cancelled) return;

        const builds = data.builds.map((build, index) => ({
          id: `build-${build.timestamp}-${index}`,
          type: "build" as const,
          timestamp: Number(build.timestamp),
          price: build.price,
          amountOvl: build.position?.initialNotional ?? "0",
          tone: getTradeHistoryTone("build", build.position?.isLong),
        }));

        const unwinds = data.unwinds.map((unwind, index) => ({
          id: `unwind-${unwind.timestamp}-${index}`,
          type: "unwind" as const,
          timestamp: Number(unwind.timestamp),
          price: unwind.price,
          amountOvl: unwind.size,
          tone: getTradeHistoryTone("unwind", unwind.position?.isLong),
        }));

        const liquidates = data.liquidates.map((liquidate, index) => ({
          id: `liquidate-${liquidate.timestamp}-${index}`,
          type: "liquidate" as const,
          timestamp: Number(liquidate.timestamp),
          price: liquidate.price,
          amountOvl: liquidate.size,
          tone: getTradeHistoryTone("liquidate", liquidate.position?.isLong),
        }));

        setTradeHistory(
          [...builds, ...unwinds, ...liquidates]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 100)
        );
      } catch {
        if (!cancelled) {
          setTradeHistoryError(true);
          setTradeHistory([]);
        }
      } finally {
        if (!cancelled) {
          setTradeHistoryLoading(false);
        }
      }
    };

    fetchTradeHistory();
    const intervalId = window.setInterval(fetchTradeHistory, 15_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [marketAddress, subgraphUrl]);

  const tradeRows = useMemo(
    () =>
      tradeHistory.map((trade) => ({
        ...trade,
        timeLabel: formatTime(trade.timestamp),
        priceLabel: formatTradePrice(trade.price, currentMarket?.priceCurrency),
        amountLabel: formatUsdAmount(trade.amountOvl, ovlPrice),
      })),
    [currentMarket?.priceCurrency, ovlPrice, tradeHistory]
  );

  return (
    <Panel aria-label="Trades">
      <Tabs>
        <TabTitle>Trades</TabTitle>
      </Tabs>

      <TradeHeaderRow>
        <span>Time</span>
        <span>Price({getPriceLabel(currentMarket?.priceCurrency)})</span>
        <span style={{ textAlign: "right" }}>Amount(USD)</span>
      </TradeHeaderRow>
      <TradeRows>
        {tradeHistoryLoading && tradeRows.length === 0 ? (
          <TradeEmpty>Loading trades...</TradeEmpty>
        ) : tradeHistoryError ? (
          <TradeEmpty>Unable to load trades</TradeEmpty>
        ) : tradeRows.length === 0 ? (
          <TradeEmpty>No trades found</TradeEmpty>
        ) : (
          tradeRows.map((trade) => (
            <TradeRow key={trade.id}>
              <span>{trade.timeLabel}</span>
              <TradePrice $tone={trade.tone}>{trade.priceLabel}</TradePrice>
              <TradeAmount>{trade.amountLabel}</TradeAmount>
            </TradeRow>
          ))
        )}
      </TradeRows>
    </Panel>
  );
};

export default OrderBookPanel;
