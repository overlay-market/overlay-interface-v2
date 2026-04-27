import styled from "styled-components";
import theme from "../../theme";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";
import { MarketDataParsed } from "../../types/marketTypes";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";

const Strip = styled.div`
  position: relative;
  height: 36px;
  min-width: 0;
  overflow: hidden;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #070809;

  &:hover .ticker-track,
  &:focus-within .ticker-track {
    animation-play-state: paused;
  }
`;

const TickerTrack = styled.div<{ $duration: number }>`
  display: flex;
  width: max-content;
  min-width: 200%;
  animation: ticker-loop ${({ $duration }) => $duration}s linear infinite;

  @keyframes ticker-loop {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    overflow-x: auto;
  }
`;

const TickerGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const TickerButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border: 0;
  border-right: 1px solid ${theme.semantic.borderMuted};
  background: ${({ $active }) => ($active ? "#101214" : "transparent")};
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textSecondary};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${theme.semantic.hover};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

const Name = styled.span`
  font-size: 12px;
  font-weight: 700;
`;

const Move = styled.span<{ $positive?: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $positive }) =>
    $positive ? theme.semantic.positive : theme.semantic.negative};
`;

const Price = styled.span`
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;

const HotDot = styled.span`
  color: ${theme.semantic.negative};
  font-size: 13px;
`;

type TradeTickerStripProps = {
  markets?: MarketDataParsed[];
  activeMarketId?: string | null;
};

const compactMarketName = (marketId: string) =>
  decodeURIComponent(marketId)
    .replace(/\s*\/\s*/g, "")
    .replace(/\s+/g, "")
    .slice(0, 14);

const formatMarketPrice = (market: MarketDataParsed) => {
  const price = market.parsedMid ?? market.mid;
  return formatPriceWithCurrency(price, market.priceCurrency);
};

const TradeTickerStrip: React.FC<TradeTickerStripProps> = ({
  markets = [],
  activeMarketId,
}) => {
  const redirectToTradePage = useRedirectToTradePage();
  const visibleMarkets = markets;
  const duration = Math.max(28, visibleMarkets.length * 2.6);

  const renderTickerGroup = (duplicate = false) => (
    <TickerGroup aria-hidden={duplicate || undefined}>
      {visibleMarkets.map((market, index) => {
        const funding = Number(market.parsedDailyFundingRate ?? market.fundingRate ?? 0);
        const isPositive = funding >= 0;
        const label = compactMarketName(market.marketId);
        const isActive =
          decodeURIComponent(activeMarketId ?? "") ===
          decodeURIComponent(market.marketId);

        return (
          <TickerButton
            key={`${duplicate ? "loop" : "base"}-${market.marketId}`}
            type="button"
            tabIndex={duplicate ? -1 : 0}
            $active={isActive}
            onClick={() => redirectToTradePage(market.marketId)}
            aria-label={`Open ${decodeURIComponent(market.marketId)}`}
          >
            {index === 0 ? <HotDot aria-hidden>◆</HotDot> : null}
            <Name>{label}</Name>
            <Price>{formatMarketPrice(market)}</Price>
            <Move $positive={isPositive}>
              {isPositive ? "+" : ""}{funding.toFixed(2)}%
            </Move>
          </TickerButton>
        );
      })}
    </TickerGroup>
  );

  return (
    <Strip aria-label="Market ticker">
      {visibleMarkets.length > 0 && (
        <TickerTrack className="ticker-track" $duration={duration}>
          {renderTickerGroup()}
          {renderTickerGroup(true)}
        </TickerTrack>
      )}
    </Strip>
  );
};

export default TradeTickerStrip;
