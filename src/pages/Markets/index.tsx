import MarketsTable from "./MarketsTable";
import { TransformedMarketData, OverlaySDK } from "overlay-sdk";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import useSDK from "../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";
import { formatNumberWithCommas, formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
import { getMarketLogo } from "../../utils/getMarketLogo";
import { isGamblingMarket } from "../../utils/marketGuards";
import {
  EXCLUDEDMARKETS,
  isVanillaMarket,
  MARKETSORDER,
} from "../../constants/markets";
import {
  FeaturedBadge,
  FeaturedContent,
  FeaturedGrid,
  FeaturedLogo,
  FeaturedMarketCard,
  FeaturedMeta,
  FeaturedName,
  FeaturedPrice,
  MarketRailPanel,
  MarketRailScroller,
  MarketsEyebrow,
  MarketsHeroMain,
  MarketsHeroPanel,
  MarketsPageShell,
  MarketsSubtitle,
  MarketsTitle,
  MarketsTitleGroup,
  MarketsHeroTop,
  ModeSwitch,
  ModeSwitchKnob,
  ModeSwitchText,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  RailDetails,
  RailLogo,
  RailMarketButton,
  RailName,
  RailText,
} from "./markets-styles";

const FEATURED_MARKETS = [
  "AERO%20%2F%20USD",
  "BTC%20%2F%20USD",
  "ETH%20%2F%20USD",
  "Double%20or%20Nothing",
];

const RAIL_MARKET_COUNT = 18;

const decodeMarketId = (marketId: string) => {
  try {
    return decodeURIComponent(marketId);
  } catch {
    return marketId;
  }
};

const orderedMarketIndex = (marketId: string) => {
  const index = MARKETSORDER.indexOf(marketId);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const formatMarketPrice = (market: TransformedMarketData) => {
  const marketName = market.marketName ?? decodeMarketId(market.marketId);
  if (isGamblingMarket(marketName)) {
    return "EVENT";
  }

  if (market.price === undefined || market.price === null) {
    return "-";
  }

  return formatPriceWithCurrency(market.price, market.priceCurrency);
};

const formatFunding = (funding: string | number | undefined) => {
  const value = Number(funding);
  if (!Number.isFinite(value)) {
    return "-";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(3)}%`;
};

const Markets: React.FC = () => {
  const [marketsData, setMarketsData] = useState<TransformedMarketData[]>([]);
  const [otherChainMarketsData, setOtherChainMarketsData] = useState<
    TransformedMarketData[]
  >([]); // new state
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const redirectToTradePage = useRedirectToTradePage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        sdk.markets.transformMarketsData().then((activeMarkets) => {
          activeMarkets && setMarketsData(activeMarkets);
        });
        // Fetch from BSC_TESTNET only (chainId 97)
        const sdkForBscTestnet = new OverlaySDK({
          chainId: 97,
          rpcUrls: {
            97: import.meta.env.VITE_BSC_TESTNET_RPC,
          },
          useShiva: true,
        });
        const bscTestnetMarkets =
          await sdkForBscTestnet.markets.transformMarketsData();
        setOtherChainMarketsData(bscTestnetMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();

    // const intervalId = setInterval(fetchData, 60000); // 5 minutes
    // return () => clearInterval(intervalId);
  }, [chainId]);

  const defaultMarketIds = useMemo(
    () => new Set(marketsData.map((market) => market.marketId)),
    [marketsData]
  );

  const uniqueOtherChainMarkets = useMemo(
    () =>
      otherChainMarketsData.filter(
        (market) => !defaultMarketIds.has(market.marketId)
      ),
    [defaultMarketIds, otherChainMarketsData]
  );

  const allMarkets = useMemo(
    () => [...marketsData, ...uniqueOtherChainMarkets],
    [marketsData, uniqueOtherChainMarkets]
  );

  const visibleMarkets = useMemo(() => {
    if (showAllMarkets) {
      return allMarkets;
    }

    return allMarkets.filter((market) => isVanillaMarket(market.marketId));
  }, [allMarkets, showAllMarkets]);

  const orderedMarkets = useMemo(() => {
    return [...visibleMarkets]
      .filter((market) => !EXCLUDEDMARKETS.includes(market.marketId))
      .sort((a, b) => {
        const orderedDelta =
          orderedMarketIndex(a.marketId) - orderedMarketIndex(b.marketId);
        if (orderedDelta !== 0) return orderedDelta;
        return decodeMarketId(a.marketId).localeCompare(decodeMarketId(b.marketId));
      });
  }, [visibleMarkets]);

  const featuredMarkets = useMemo(() => {
    const selected = FEATURED_MARKETS.map((marketId) =>
      orderedMarkets.find((market) => market.marketId === marketId)
    ).filter(Boolean) as TransformedMarketData[];

    const selectedIds = new Set(selected.map((market) => market.marketId));
    const fallbackMarkets = orderedMarkets.filter(
      (market) => !selectedIds.has(market.marketId)
    );

    return [...selected, ...fallbackMarkets].slice(0, 4);
  }, [orderedMarkets]);

  const handleMarketSelect = (market: TransformedMarketData) => {
    if (!defaultMarketIds.has(market.marketId)) {
      return;
    }

    redirectToTradePage(market.marketId);
  };

  return (
    <MarketsPageShell $expanded={showAllMarkets}>
      <MarketsHeroPanel $expanded={showAllMarkets}>
        <MarketsHeroMain>
          <MarketsHeroTop>
            <MarketsTitleGroup>
              <MarketsEyebrow>Overlay Market Terminal</MarketsEyebrow>
              <MarketsTitle>Markets</MarketsTitle>
              <MarketsSubtitle>
                {showAllMarkets
                  ? "Live perps, prediction markets, index feeds, and queued markets in one expanded directory."
                  : "Live crypto and commodity perps in one compact trading directory."}
              </MarketsSubtitle>
            </MarketsTitleGroup>
            <ModeSwitch
              type="button"
              role="switch"
              aria-checked={showAllMarkets}
              $active={showAllMarkets}
              onClick={() => setShowAllMarkets((active) => !active)}
            >
              <ModeSwitchKnob $active={showAllMarkets} />
              <ModeSwitchText>
                {showAllMarkets ? "All markets" : "Core markets"}
              </ModeSwitchText>
            </ModeSwitch>
          </MarketsHeroTop>

          <FeaturedGrid>
            {featuredMarkets.map((market) => {
              const marketName = decodeMarketId(market.marketId);
              const isComingSoon = !defaultMarketIds.has(market.marketId);
              const funding = Number(market.funding);
              const tone = funding < 0 ? "negative" : "positive";

              return (
                <FeaturedMarketCard
                  key={market.marketId}
                  type="button"
                  $expanded={showAllMarkets}
                  $muted={isComingSoon}
                  disabled={isComingSoon}
                  onClick={() => handleMarketSelect(market)}
                >
                  <FeaturedLogo
                    src={getMarketLogo(market.marketId)}
                    alt={marketName}
                    $muted={isComingSoon}
                  />
                  <FeaturedContent>
                    <FeaturedMeta>
                      <FeaturedBadge>
                        {isComingSoon ? "Queued" : "Live"}
                      </FeaturedBadge>
                      <FeaturedBadge>
                        Funding {formatFunding(market.funding)}
                      </FeaturedBadge>
                    </FeaturedMeta>
                    <FeaturedName>{marketName}</FeaturedName>
                    <FeaturedPrice $tone={tone}>
                      {formatMarketPrice(market)}
                    </FeaturedPrice>
                  </FeaturedContent>
                </FeaturedMarketCard>
              );
            })}
          </FeaturedGrid>
        </MarketsHeroMain>
      </MarketsHeroPanel>

      <MarketRailPanel>
        <PanelHeader>
          <PanelTitle>{showAllMarkets ? "All Markets" : "Core Markets"}</PanelTitle>
          <PanelMeta>{formatNumberWithCommas(orderedMarkets.length)}</PanelMeta>
        </PanelHeader>
        <MarketRailScroller aria-label="Featured markets">
          {orderedMarkets.slice(0, RAIL_MARKET_COUNT).map((market) => {
            const isComingSoon = !defaultMarketIds.has(market.marketId);
            const funding = Number(market.funding);
            const tone = funding < 0 ? "negative" : "positive";

            return (
              <RailMarketButton
                key={market.marketId}
                type="button"
                $disabled={isComingSoon}
                disabled={isComingSoon}
                onClick={() => handleMarketSelect(market)}
              >
                <RailLogo
                  src={getMarketLogo(market.marketId)}
                  alt={decodeMarketId(market.marketId)}
                />
                <RailText>
                  <RailName>{decodeMarketId(market.marketId)}</RailName>
                  <RailDetails $tone={tone}>
                    {formatMarketPrice(market)} / {formatFunding(market.funding)}
                  </RailDetails>
                </RailText>
              </RailMarketButton>
            );
          })}
        </MarketRailScroller>
      </MarketRailPanel>

      <MarketsTable
        marketsData={marketsData}
        otherChainMarketsData={otherChainMarketsData}
        showAllMarkets={showAllMarkets}
      />
    </MarketsPageShell>
  );
};

export default Markets;
