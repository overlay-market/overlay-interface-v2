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
  getMarketClass,
  MarketClass,
  MARKETSORDER,
} from "../../constants/markets";
import {
  FeaturedBadge,
  FeaturedContent,
  FeaturedGrid,
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
  MarketsStatCard,
  MarketsStatsPanel,
  MarketsStatusPill,
  MarketsSubtitle,
  MarketsTitle,
  MarketsTitleGroup,
  MarketsHeroTop,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  RailDetails,
  RailLogo,
  RailMarketButton,
  RailName,
  RailText,
  StatLabel,
  StatValue,
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
  const [currentPrice, setCurrentPrice] = useState<number | undefined>();
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const redirectToTradePage = useRedirectToTradePage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        sdk.markets.transformMarketsData().then((activeMarkets) => {
          activeMarkets && setMarketsData(activeMarkets);
        });
        sdk.ovl.price().then((price) => {
          price && setCurrentPrice(price);
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

  const orderedMarkets = useMemo(() => {
    return [...allMarkets]
      .filter((market) => !EXCLUDEDMARKETS.includes(market.marketId))
      .sort((a, b) => {
        const orderedDelta =
          orderedMarketIndex(a.marketId) - orderedMarketIndex(b.marketId);
        if (orderedDelta !== 0) return orderedDelta;
        return decodeMarketId(a.marketId).localeCompare(decodeMarketId(b.marketId));
      });
  }, [allMarkets]);

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

  const vanillaCount = useMemo(
    () =>
      marketsData.filter(
        (market) => getMarketClass(market.marketId) === MarketClass.Vanilla
      ).length,
    [marketsData]
  );

  const liveMarketCount = marketsData.length;
  const exoticCount = Math.max(liveMarketCount - vanillaCount, 0);
  const ovlPrice =
    currentPrice === undefined
      ? "-"
      : formatPriceWithCurrency(currentPrice, "$");

  const handleMarketSelect = (market: TransformedMarketData) => {
    if (!defaultMarketIds.has(market.marketId)) {
      return;
    }

    redirectToTradePage(market.marketId);
  };

  return (
    <MarketsPageShell>
      <MarketsHeroPanel>
        <MarketsHeroMain>
          <MarketsHeroTop>
            <MarketsTitleGroup>
              <MarketsEyebrow>Overlay Market Terminal</MarketsEyebrow>
              <MarketsTitle>Markets</MarketsTitle>
              <MarketsSubtitle>
                Live perps, prediction markets, and exotic feeds in one dense
                trading directory.
              </MarketsSubtitle>
            </MarketsTitleGroup>
            <MarketsStatusPill>Live</MarketsStatusPill>
          </MarketsHeroTop>

          <FeaturedGrid>
            {featuredMarkets.map((market) => {
              const marketName = decodeMarketId(market.marketId);
              const isComingSoon = !defaultMarketIds.has(market.marketId);
              const funding = Number(market.funding);
              const tone = funding < 0 ? "negative" : "positive";
              const marketClass = getMarketClass(market.marketId);

              return (
                <FeaturedMarketCard
                  key={market.marketId}
                  type="button"
                  $image={getMarketLogo(market.marketId)}
                  $muted={isComingSoon}
                  disabled={isComingSoon}
                  onClick={() => handleMarketSelect(market)}
                >
                  <FeaturedContent>
                    <FeaturedMeta>
                      <FeaturedBadge>
                        {isComingSoon ? "Coming Soon" : marketClass}
                      </FeaturedBadge>
                      <FeaturedBadge>{formatFunding(market.funding)}</FeaturedBadge>
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

        <MarketsStatsPanel>
          <MarketsStatCard>
            <StatLabel>Live Markets</StatLabel>
            <StatValue>{formatNumberWithCommas(liveMarketCount)}</StatValue>
          </MarketsStatCard>
          <MarketsStatCard>
            <StatLabel>Vanilla</StatLabel>
            <StatValue>{formatNumberWithCommas(vanillaCount)}</StatValue>
          </MarketsStatCard>
          <MarketsStatCard>
            <StatLabel>Exotics</StatLabel>
            <StatValue>{formatNumberWithCommas(exoticCount)}</StatValue>
          </MarketsStatCard>
          <MarketsStatCard>
            <StatLabel>OVL Price</StatLabel>
            <StatValue>{ovlPrice}</StatValue>
          </MarketsStatCard>
        </MarketsStatsPanel>
      </MarketsHeroPanel>

      <MarketRailPanel>
        <PanelHeader>
          <PanelTitle>Active Tape</PanelTitle>
          <PanelMeta>{formatNumberWithCommas(uniqueOtherChainMarkets.length)} queued</PanelMeta>
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
      />
    </MarketsPageShell>
  );
};

export default Markets;
