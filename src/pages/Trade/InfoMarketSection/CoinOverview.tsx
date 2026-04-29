import React, { useEffect, useMemo, useState } from "react";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import {
  formatNumberWithCommas,
  formatPriceWithCurrency,
} from "../../../utils/formatPriceWithCurrency";
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
  FactCell,
  FactGrid,
  FactLabel,
  FactValue,
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
  ReadToggle,
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

const formatMarketPrice = (
  value?: string | number,
  priceCurrency: string = "$"
) => {
  if (value === undefined || value === null || value === "") return "-";
  return formatPriceWithCurrency(value, priceCurrency);
};

const formatPercent = (value?: string | number) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return "-";

  return `${numericValue >= 0 ? "+" : ""}${numericValue.toFixed(2)}%`;
};

const formatOpenInterest = (value?: string | number) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) return "-";

  return formatNumberWithCommas(numericValue);
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
  const { totalVolume, totalTokensLocked, totalTransactions } =
    useMarketAnalytics();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [currentMarket?.id]);

  const paragraphs = useMemo(
    () => splitDescription(currentMarket?.descriptionText),
    [currentMarket?.descriptionText]
  );

  const leadText =
    paragraphs[0] ?? UNKNOWN_DESCRIPTION;
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
  const fundingValue = Number(
    currentMarket?.parsedDailyFundingRate ?? currentMarket?.fundingRate
  );
  const fundingTone = fundingValue >= 0 ? "positive" : "negative";
  const marketLogo =
    currentMarket?.marketId ? getMarketLogo(currentMarket.marketId) : undefined;

  const facts = [
    {
      label: "Last Price",
      value: formatMarketPrice(
        currentMarket?.parsedMid ?? currentMarket?.mid,
        currentMarket?.priceCurrency
      ),
      tone: undefined,
    },
    {
      label: "Funding / 24h",
      value: formatPercent(
        currentMarket?.parsedDailyFundingRate ?? currentMarket?.fundingRate
      ),
      tone: fundingTone,
    },
    {
      label: "Open Interest",
      value: formatOpenInterest(totalOi),
      tone: undefined,
    },
    {
      label: "Cap OI",
      value: formatOpenInterest(
        currentMarket?.parsedCapOi ?? currentMarket?.capOi
      ),
      tone: undefined,
    },
  ] as const;

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

        <FactGrid>
          {facts.map((fact) => (
            <FactCell key={fact.label}>
              <FactLabel>{fact.label}</FactLabel>
              <FactValue $tone={fact.tone}>{fact.value}</FactValue>
            </FactCell>
          ))}
        </FactGrid>

        <DescriptionGrid>
          <NarrativePanel>
            <SectionHeader>
              <SectionTitle>About This Market</SectionTitle>
            </SectionHeader>
            <DescriptionText $expanded={expanded}>
              {displayedDescription.map((paragraph, index) => (
                <p key={index}>{renderWithLinks(paragraph)}</p>
              ))}
            </DescriptionText>
            {(detailParagraphs.length > 0 || paragraphs.length > 1) && (
              <ReadToggle
                type="button"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "Read Less" : "Read More"}
              </ReadToggle>
            )}
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
                  <span>Long OI</span>
                  <OiValue>{formatOpenInterest(longOi)}</OiValue>
                </OiRow>
                <OiRow>
                  <span>Short OI</span>
                  <OiValue>{formatOpenInterest(shortOi)}</OiValue>
                </OiRow>
                <OiRow>
                  <span>Market ID</span>
                  <OiValue>{currentMarket?.marketId ?? "-"}</OiValue>
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
