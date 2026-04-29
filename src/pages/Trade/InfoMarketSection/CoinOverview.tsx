import React, { useMemo } from "react";
import { useAggregatorContracts } from "../../../hooks/useAggregatorContracts";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import { getMarketLogo } from "../../../utils/getMarketLogo";
import { useMarketAnalytics } from "./useMarketAnalytics";
import {
  BarSegment,
  BarTrack,
  DescriptionGrid,
  DescriptionText,
  DossierHeader,
  DossierPanel,
  DossierTop,
  Eyebrow,
  LeadText,
  LeverageBadge,
  LogoFrame,
  LogoOverlay,
  MarketAddress,
  MarketLogo,
  MarketTitle,
  MarketTitleRow,
  MicroPanel,
  NarrativePanel,
  OiPanel,
  OiRow,
  OiRows,
  OiValue,
  OverviewShell,
  SectionHeader,
  SectionTitle,
  SmallLogo,
  StatCaption,
  StatCard,
  StatLabel,
  StatRail,
  StatValue,
} from "./coin-overview-styles";

const URL_REGEX = /(https?:\/\/[^\s)]+)(?=[\s)]|$)/g;
const UNKNOWN_LEVERAGE_LABEL = "LOREM IPSUM"; // TODO: Replace when the market payload does not include capLeverage.
const UNKNOWN_DESCRIPTION = "LOREM IPSUM"; // TODO: Replace when the market payload does not include descriptionText.

const renderWithLinks = (text: string): React.ReactNode[] => {
  const parts = text.split(URL_REGEX);

  return parts.map((part, index) => {
    const isUrl = part.startsWith("http://") || part.startsWith("https://");

    if (!isUrl) return <React.Fragment key={index}>{part}</React.Fragment>;

    return (
      <a href={part} target="_blank" rel="noopener noreferrer" key={index}>
        {part}
      </a>
    );
  });
};

const splitDescription = (description?: string) =>
  (description ?? "")
    .split(/\\n|\n/g)
    .map((part) => part.trim())
    .filter(Boolean);

const formatLeverage = (capLeverage?: string | number | null) => {
  const leverage = Number(capLeverage);

  if (!Number.isFinite(leverage) || leverage <= 0) {
    return UNKNOWN_LEVERAGE_LABEL;
  }

  return `${Number.isInteger(leverage) ? leverage : leverage.toFixed(1).replace(/\.0$/, "")}x`;
};

const formatUsdOpenInterest = (value?: number) => {
  if (value === undefined || !Number.isFinite(value) || value < 0) return "-";

  return formatPriceWithCurrency(value, "$");
};

const formatCompactAddress = (address?: string) => {
  if (!address) return "-";
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const normalizeTickerKey = (value?: string) => {
  if (!value) return "";

  try {
    return decodeURIComponent(value)
      .toUpperCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  } catch {
    return value
      .toUpperCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
};

const getAggregatorTickerKeys = (marketName?: string, marketId?: string) => {
  const pairKeys = new Set(
    [marketName, marketId]
      .map(normalizeTickerKey)
      .filter((key) => key.length > 0)
  );

  return new Set(
    Array.from(pairKeys).flatMap((key) => [key, `${key}-PERP`])
  );
};

const getQuoteUsdMultiplier = (
  openInterest?: number,
  openInterestUsd?: number,
  lastPrice?: number
) => {
  if (
    !openInterest ||
    !openInterestUsd ||
    !lastPrice ||
    !Number.isFinite(openInterest) ||
    !Number.isFinite(openInterestUsd) ||
    !Number.isFinite(lastPrice)
  ) {
    return undefined;
  }

  return openInterestUsd / (openInterest * lastPrice);
};

const normalizeAnalyticsValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "-";
};

const CoinOverview: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const { data: aggregatorContracts = [] } = useAggregatorContracts();
  const { totalVolume, totalTokensLocked, totalTransactions } =
    useMarketAnalytics();

  const paragraphs = useMemo(
    () => splitDescription(currentMarket?.descriptionText),
    [currentMarket?.descriptionText]
  );

  const leadText = paragraphs[0] ?? UNKNOWN_DESCRIPTION;
  const detailParagraphs = paragraphs.slice(1);
  const displayedDescription =
    detailParagraphs.length > 0
      ? detailParagraphs
      : paragraphs.length > 0
        ? paragraphs
        : [UNKNOWN_DESCRIPTION];

  const longOi = Number(currentMarket?.parsedOiLong ?? 0);
  const shortOi = Number(currentMarket?.parsedOiShort ?? 0);
  const totalOi = longOi + shortOi;
  const longShare = totalOi > 0 ? (longOi / totalOi) * 100 : 0;
  const shortShare = totalOi > 0 ? 100 - longShare : 0;
  const marketLogo =
    currentMarket?.marketId ? getMarketLogo(currentMarket.marketId) : undefined;

  const aggregatorContract = useMemo(() => {
    const tickerKeys = getAggregatorTickerKeys(
      currentMarket?.marketName,
      currentMarket?.marketId
    );

    if (tickerKeys.size === 0) return undefined;

    return aggregatorContracts.find((contract) => {
      const contractKeys = [
        contract.ticker_id,
        contract.index_name,
        `${contract.base_currency}-${contract.target_currency}`,
      ].map(normalizeTickerKey);

      return contractKeys.some((key) => tickerKeys.has(key));
    });
  }, [aggregatorContracts, currentMarket?.marketId, currentMarket?.marketName]);
  const openInterestPrice = Number(
    aggregatorContract?.last_price ??
      currentMarket?.parsedMid ??
      currentMarket?.mid
  );
  const quoteUsdMultiplier =
    getQuoteUsdMultiplier(
      aggregatorContract?.open_interest,
      aggregatorContract?.open_interest_usd,
      aggregatorContract?.last_price
    ) ?? (currentMarket?.priceCurrency === "$" ? 1 : undefined);
  const canCalculateOpenInterestUsd =
    Number.isFinite(openInterestPrice) &&
    openInterestPrice > 0 &&
    quoteUsdMultiplier !== undefined;
  const longOiUsd = canCalculateOpenInterestUsd
    ? longOi * openInterestPrice * quoteUsdMultiplier
    : undefined;
  const shortOiUsd = canCalculateOpenInterestUsd
    ? shortOi * openInterestPrice * quoteUsdMultiplier
    : undefined;
  const totalOiUsd =
    longOiUsd !== undefined && shortOiUsd !== undefined
      ? longOiUsd + shortOiUsd
      : undefined;

  return (
    <OverviewShell>
      <DossierPanel>
        <DossierTop>
          <LogoFrame>
            {marketLogo ? (
              <MarketLogo
                src={marketLogo}
                alt={`${currentMarket?.marketName ?? "Market"} visual`}
              />
            ) : null}
            <LogoOverlay>
              {currentMarket?.marketLogo ? (
                <SmallLogo
                  src={currentMarket.marketLogo}
                  alt={`${currentMarket.marketName} icon`}
                />
              ) : null}
              <LeverageBadge>
                {formatLeverage(currentMarket?.capLeverage)}
              </LeverageBadge>
            </LogoOverlay>
          </LogoFrame>

          <DossierHeader>
            <Eyebrow>Market dossier</Eyebrow>
            <MarketTitleRow>
              <MarketTitle>{currentMarket?.marketName ?? "Market"}</MarketTitle>
              <LeverageBadge>
                {formatLeverage(currentMarket?.capLeverage)}
              </LeverageBadge>
            </MarketTitleRow>
            <MarketAddress title={currentMarket?.id}>
              {formatCompactAddress(currentMarket?.id)}
            </MarketAddress>
            <LeadText>{leadText}</LeadText>
          </DossierHeader>
        </DossierTop>

        <DescriptionGrid>
          <NarrativePanel>
            <SectionHeader>
              <SectionTitle>About This Market</SectionTitle>
            </SectionHeader>
            <DescriptionText>
              {displayedDescription.map((paragraph, index) => (
                <p key={index}>{renderWithLinks(paragraph)}</p>
              ))}
            </DescriptionText>
          </NarrativePanel>

          <MicroPanel>
            <OiPanel>
              <SectionHeader>
                <SectionTitle>Position Mix</SectionTitle>
              </SectionHeader>
              <BarTrack aria-label="Open interest mix">
                <BarSegment $side="long" $width={longShare} />
                <BarSegment $side="short" $width={shortShare} />
              </BarTrack>
              <OiRows>
                <OiRow>
                  <span>Long OI (USD)</span>
                  <OiValue>{formatUsdOpenInterest(longOiUsd)}</OiValue>
                </OiRow>
                <OiRow>
                  <span>Short OI (USD)</span>
                  <OiValue>{formatUsdOpenInterest(shortOiUsd)}</OiValue>
                </OiRow>
                <OiRow>
                  <span>Total OI (USD)</span>
                  <OiValue>{formatUsdOpenInterest(totalOiUsd)}</OiValue>
                </OiRow>
              </OiRows>
            </OiPanel>
          </MicroPanel>
        </DescriptionGrid>
      </DossierPanel>

      <StatRail aria-label="Market analytics">
        <StatCard>
          <StatLabel>Total Volume</StatLabel>
          <StatValue>{normalizeAnalyticsValue(totalVolume)}</StatValue>
          <StatCaption>Converted from OVL using the oracle price.</StatCaption>
        </StatCard>
        <StatCard>
          <StatLabel>Tokens Locked</StatLabel>
          <StatValue>{normalizeAnalyticsValue(totalTokensLocked)}</StatValue>
          <StatCaption>Aggregated across deployments for this market.</StatCaption>
        </StatCard>
        <StatCard>
          <StatLabel>Transactions</StatLabel>
          <StatValue>{normalizeAnalyticsValue(totalTransactions)}</StatValue>
          <StatCaption>Builds, unwinds, and liquidations.</StatCaption>
        </StatCard>
      </StatRail>
    </OverviewShell>
  );
};

export default CoinOverview;
