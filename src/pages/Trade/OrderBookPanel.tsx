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

const Tab = styled.button<{ $active?: boolean }>`
  height: 44px;
  padding: 0;
  border: 0;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? theme.semantic.textPrimary : "transparent")};
  background: transparent;
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

const LayoutButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 14px;
`;

const LayoutSwatch = styled.span<{ $tone: "both" | "bid" | "ask" }>`
  display: inline-grid;
  grid-template-columns: 7px 7px;
  grid-template-rows: 7px 7px;
  gap: 2px;

  &::before,
  &::after {
    content: "";
    display: block;
    border-radius: 1px;
  }

  &::before {
    background: ${({ $tone }) =>
      $tone === "bid" ? theme.semantic.positive : theme.semantic.negative};
  }

  &::after {
    background: ${({ $tone }) =>
      $tone === "ask" ? theme.semantic.negative : theme.semantic.positive};
  }
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.95fr 0.95fr;
  gap: 8px;
  padding: 8px 14px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const BookRow = styled.div<{ $side: "ask" | "bid"; $fill: number }>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 0.95fr 0.95fr;
  gap: 8px;
  min-height: 22px;
  padding: 2px 14px;
  overflow: hidden;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  line-height: 18px;

  &::before {
    content: "";
    position: absolute;
    top: 1px;
    bottom: 1px;
    right: 0;
    width: ${({ $fill }) => $fill}%;
    background: ${({ $side }) =>
      $side === "ask"
        ? "rgba(240, 68, 94, 0.22)"
        : "rgba(40, 209, 154, 0.18)"};
    pointer-events: none;
  }

  span {
    position: relative;
    z-index: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const PriceCell = styled.span<{ $side: "ask" | "bid" }>`
  color: ${({ $side }) =>
    $side === "ask" ? theme.semantic.negative : theme.semantic.positive};
  font-weight: 700;
`;

const MidPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 14px;
  border-top: 1px solid ${theme.semantic.borderMuted};
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  color: ${theme.semantic.positive};
  font-family: "Roboto Mono", monospace;
  font-size: 22px;
  font-weight: 800;
`;

const MarkPrice = styled.span`
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 500;
`;

const Ratio = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding: 10px 14px 12px;
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 700;
`;

const RatioBar = styled.div`
  display: flex;
  flex: 1;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: ${theme.semantic.borderMuted};
`;

const RatioBid = styled.span<{ $value: number }>`
  width: ${({ $value }) => $value}%;
  background: ${theme.semantic.positive};
`;

const RatioAsk = styled.span`
  flex: 1;
  background: ${theme.semantic.negative};
`;

const TradeHeaderRow = styled(HeaderRow)`
  grid-template-columns: 0.78fr 1fr 1fr;
  padding-top: 14px;
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

const TradePrice = styled.span<{ $type: TradeHistoryType }>`
  color: ${({ $type }) =>
    $type === "build" ? theme.semantic.positive : theme.semantic.negative};
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

type ActiveTab = "order-book" | "trades";
type TradeHistoryType = "build" | "unwind";

type BuildTrade = {
  timestamp: string;
  price: string;
  position?: {
    initialNotional?: string;
  } | null;
};

type UnwindTrade = {
  timestamp: string;
  price: string;
  size: string;
};

type TradeHistoryResponse = {
  builds: BuildTrade[];
  unwinds: UnwindTrade[];
};

type TradeHistoryEntry = {
  id: string;
  type: TradeHistoryType;
  timestamp: number;
  price: string;
  amountOvl: string;
};

const ORDER_BOOK_DEPTH_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace with real order book amount/sum depth when the API is available.
const ORDER_BOOK_PRICE_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace with real order book price fallback when the API is available.
const TRADE_HISTORY_AMOUNT_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace when the OVL/USD price feed is unavailable.

const toNumber = (value?: bigint) =>
  value === undefined ? undefined : Number(value) / 1e18;

const formatBookPrice = (value?: number) => {
  if (!Number.isFinite(value)) return ORDER_BOOK_PRICE_PLACEHOLDER;
  if (Math.abs(value as number) >= 1000) return (value as number).toLocaleString(undefined, { maximumFractionDigits: 1 });
  return (value as number).toFixed(4);
};

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
    return formatPriceByCurrency(formatUnits(BigInt(price), 18), priceCurrency ?? "$");
  } catch {
    return ORDER_BOOK_PRICE_PLACEHOLDER;
  }
};

const getPriceLabel = (priceCurrency?: string) => {
  if (!priceCurrency || priceCurrency === "$") return "USD";
  return priceCurrency;
};

const OrderBookPanel: React.FC<OrderBookPanelProps> = ({ prices }) => {
  const { currentMarket } = useCurrentMarketState();
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];
  const { data: ovlPrice } = useOvlPrice();
  const [activeTab, setActiveTab] = useState<ActiveTab>("order-book");
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryEntry[]>([]);
  const [tradeHistoryLoading, setTradeHistoryLoading] = useState(false);
  const [tradeHistoryError, setTradeHistoryError] = useState(false);
  const marketAddress = currentMarket?.id?.toLowerCase();
  const mid =
    toNumber(prices?.mid) ??
    Number(currentMarket?.parsedMid ?? currentMarket?.mid ?? 0);
  const ask = toNumber(prices?.ask) ?? mid * 1.0006;
  const bid = toNumber(prices?.bid) ?? mid * 0.9994;
  const longOi = Number(currentMarket?.parsedOiLong ?? currentMarket?.oiLong ?? 0);
  const shortOi = Number(currentMarket?.parsedOiShort ?? currentMarket?.oiShort ?? 0);
  const bidShare = longOi + shortOi > 0 ? (longOi / (longOi + shortOi)) * 100 : 56.92;
  const safeBidShare = Number.isFinite(bidShare)
    ? Math.min(100, Math.max(0, bidShare))
    : 56.92;

  const asks = Array.from({ length: 8 }, (_, index) => ask + (8 - index) * Math.max(mid * 0.00008, 0.0001));
  const bids = Array.from({ length: 8 }, (_, index) => bid - index * Math.max(mid * 0.00008, 0.0001));

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
        }));

        const unwinds = data.unwinds.map((unwind, index) => ({
          id: `unwind-${unwind.timestamp}-${index}`,
          type: "unwind" as const,
          timestamp: Number(unwind.timestamp),
          price: unwind.price,
          amountOvl: unwind.size,
        }));

        setTradeHistory(
          [...builds, ...unwinds]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 100)
        );
      } catch (error) {
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
    <Panel aria-label={activeTab === "order-book" ? "Order book" : "Trades"}>
      <Tabs>
        <Tab
          type="button"
          $active={activeTab === "order-book"}
          onClick={() => setActiveTab("order-book")}
        >
          Order Book
        </Tab>
        <Tab
          type="button"
          $active={activeTab === "trades"}
          onClick={() => setActiveTab("trades")}
        >
          Trades
        </Tab>
      </Tabs>

      {activeTab === "order-book" ? (
        <>
          <LayoutButtons aria-hidden>
            <LayoutSwatch $tone="both" />
            <LayoutSwatch $tone="bid" />
            <LayoutSwatch $tone="ask" />
          </LayoutButtons>
          <HeaderRow>
            <span>Price</span>
            <span>Amount</span>
            <span>Sum</span>
          </HeaderRow>
          <Rows>
            {asks.map((price, index) => (
              <BookRow key={`ask-${index}`} $side="ask" $fill={90 - index * 8}>
                <PriceCell $side="ask">{formatBookPrice(price)}</PriceCell>
                <span>{ORDER_BOOK_DEPTH_PLACEHOLDER}</span>
                <span>{ORDER_BOOK_DEPTH_PLACEHOLDER}</span>
              </BookRow>
            ))}
          </Rows>
          <MidPrice>
            {formatBookPrice(mid)}
            <MarkPrice>{formatBookPrice(bid)}</MarkPrice>
          </MidPrice>
          <Rows>
            {bids.map((price, index) => (
              <BookRow key={`bid-${index}`} $side="bid" $fill={96 - index * 8}>
                <PriceCell $side="bid">{formatBookPrice(price)}</PriceCell>
                <span>{ORDER_BOOK_DEPTH_PLACEHOLDER}</span>
                <span>{ORDER_BOOK_DEPTH_PLACEHOLDER}</span>
              </BookRow>
            ))}
          </Rows>
          <Ratio>
            <span style={{ color: theme.semantic.positive }}>B {safeBidShare.toFixed(2)}%</span>
            <RatioBar>
              <RatioBid $value={safeBidShare} />
              <RatioAsk />
            </RatioBar>
            <span style={{ color: theme.semantic.negative }}>S {(100 - safeBidShare).toFixed(2)}%</span>
          </Ratio>
        </>
      ) : (
        <>
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
                  <TradePrice $type={trade.type}>{trade.priceLabel}</TradePrice>
                  <TradeAmount>{trade.amountLabel}</TradeAmount>
                </TradeRow>
              ))
            )}
          </TradeRows>
        </>
      )}
    </Panel>
  );
};

export default OrderBookPanel;
