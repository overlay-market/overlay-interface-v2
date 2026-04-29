import React, { useMemo } from "react";
import { useAggregatorContracts } from "../../../hooks/useAggregatorContracts";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import {
  formatUsdOpenInterest,
  getMarketOpenInterestUsd,
} from "../../../utils/openInterestUsd";
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
  StatCard,
  StatLabel,
  StatRail,
  StatValue,
} from "./coin-overview-styles";

const URL_REGEX = /(https?:\/\/[^\s)]+)(?=[\s)]|$)/g;
const UNAVAILABLE_DESCRIPTION = "Market details are currently unavailable.";

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
    return undefined;
  }

  return `${Number.isInteger(leverage) ? leverage : leverage.toFixed(1).replace(/\.0$/, "")}x`;
};

const formatCompactAddress = (address?: string) => {
  if (!address) return "-";
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
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

  const leadText = paragraphs[0] ?? UNAVAILABLE_DESCRIPTION;
  const detailParagraphs = paragraphs.slice(1);
  const displayedDescription =
    detailParagraphs.length > 0
      ? detailParagraphs
      : paragraphs.length > 0
        ? paragraphs
        : [UNAVAILABLE_DESCRIPTION];

  const { longOi, totalOi, longOiUsd, shortOiUsd, totalOiUsd } =
    getMarketOpenInterestUsd(currentMarket, aggregatorContracts);
  const longShare = totalOi > 0 ? (longOi / totalOi) * 100 : 0;
  const shortShare = totalOi > 0 ? 100 - longShare : 0;
  const marketLogo =
    currentMarket?.marketId ? getMarketLogo(currentMarket.marketId) : undefined;
  const leverageLabel = formatLeverage(currentMarket?.capLeverage);

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
              {leverageLabel ? (
                <LeverageBadge>{leverageLabel}</LeverageBadge>
              ) : null}
            </LogoOverlay>
          </LogoFrame>

          <DossierHeader>
            <Eyebrow>Market dossier</Eyebrow>
            <MarketTitleRow>
              <MarketTitle>{currentMarket?.marketName ?? "Market"}</MarketTitle>
              {leverageLabel ? (
                <LeverageBadge>{leverageLabel}</LeverageBadge>
              ) : null}
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
        </StatCard>
        <StatCard>
          <StatLabel>Tokens Locked</StatLabel>
          <StatValue>{normalizeAnalyticsValue(totalTokensLocked)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Transactions</StatLabel>
          <StatValue>{normalizeAnalyticsValue(totalTransactions)}</StatValue>
        </StatCard>
      </StatRail>
    </OverviewShell>
  );
};

export default CoinOverview;
