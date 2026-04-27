import styled from "styled-components";
import theme from "../../theme";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";

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

type OrderBookPanelProps = {
  prices?: { bid: bigint; ask: bigint; mid: bigint };
};

const ORDER_BOOK_DEPTH_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace with real order book amount/sum depth when the API is available.
const ORDER_BOOK_PRICE_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace with real order book price fallback when the API is available.

const toNumber = (value?: bigint) =>
  value === undefined ? undefined : Number(value) / 1e18;

const formatBookPrice = (value?: number) => {
  if (!Number.isFinite(value)) return ORDER_BOOK_PRICE_PLACEHOLDER;
  if (Math.abs(value as number) >= 1000) return (value as number).toLocaleString(undefined, { maximumFractionDigits: 1 });
  return (value as number).toFixed(4);
};

const OrderBookPanel: React.FC<OrderBookPanelProps> = ({ prices }) => {
  const { currentMarket } = useCurrentMarketState();
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

  return (
    <Panel aria-label="Order book">
      <Tabs>
        <Tab type="button" $active>Order Book</Tab>
        <Tab type="button" disabled>Trades</Tab>
      </Tabs>
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
    </Panel>
  );
};

export default OrderBookPanel;
