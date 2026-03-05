import { forwardRef } from "react";
import { OpenPositionData, UnwindStateSuccess } from "overlay-sdk";
import { getMarketImage } from "../../../utils/shareUtils";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import { getDurationString } from "../../../utils/shareUtils";
import OverlayLogo from "../../../assets/images/overlay-logo-only-no-background.png";
import {
  ShareCardContainer,
  HeroSection,
  HeroBackgroundImage,
  HeroGradientOverlay,
  HeroContent,
  LogoContainer,
  OverlayLogoImg,
  MarketSection,
  ProfitSection,
  ProfitMainText,
  ProfitPercentageText,
  BottomSection,
  DetailsSection,
  DetailRow,
  DetailLabel,
  DetailValue,
  BrandingSection,
  BrandingText,
  MarketNameText,
  PositionTypeText,
} from "./share-success-styles";

export type ProfitDisplayMode = 'absolute' | 'percentage' | 'both';

type ShareCardProps = {
  position: OpenPositionData;
  unwindState: UnwindStateSuccess;
  profitAmount: number;
  profitPercentage: number;
  positionSide?: string;
  positionLeverage?: string;
  profitDisplayMode?: ProfitDisplayMode;
  isProfit?: boolean;
  tokenLabel?: string;
};

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  (
    {
      position,
      unwindState,
      profitAmount,
      profitPercentage,
      positionSide,
      positionLeverage,
      profitDisplayMode = 'both',
      isProfit = true,
      tokenLabel = "OVL",
    },
    ref
  ) => {
    const marketImage = getMarketImage(position.marketName || "Unknown Market");
    const entryPrice = unwindState.entryPrice
      ? formatPriceByCurrency(
          unwindState.entryPrice as string,
          position.priceCurrency || "USD"
        )
      : "N/A";
    const currentPrice = unwindState.currentPrice
      ? formatPriceByCurrency(
          unwindState.currentPrice as string,
          position.priceCurrency || "USD"
        )
      : "N/A";

    const duration = getDurationString(position.parsedCreatedTimestamp || "");

    return (
      <ShareCardContainer ref={ref}>
        {/* Top section with market image as background */}
        <HeroSection>
          <HeroBackgroundImage src={marketImage} alt="" crossOrigin="anonymous" />
          <HeroGradientOverlay />
          <HeroContent>
            {/* Header with Overlay Logo */}
            <LogoContainer>
              <OverlayLogoImg src={OverlayLogo} alt="Overlay" />
            </LogoContainer>

            {/* Market Name and Position Info */}
            <MarketSection>
              <MarketNameText>{position.marketName}</MarketNameText>
              <PositionTypeText>
                🎯 {positionSide?.toUpperCase()} {positionLeverage}
              </PositionTypeText>
            </MarketSection>

            {/* Profit Display */}
            <ProfitSection>
              {profitDisplayMode === 'absolute' && (
                <ProfitMainText isProfit={isProfit}>
                  {profitAmount >= 0 ? "+" : ""}{profitAmount.toFixed(2)} {tokenLabel}
                </ProfitMainText>
              )}
              {profitDisplayMode === 'percentage' && (
                <ProfitMainText isProfit={isProfit}>
                  {profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}% {isProfit ? "📈" : "📉"}
                </ProfitMainText>
              )}
              {profitDisplayMode === 'both' && (
                <>
                  <ProfitMainText isProfit={isProfit}>
                    {profitAmount >= 0 ? "+" : ""}{profitAmount.toFixed(2)} {tokenLabel}
                  </ProfitMainText>
                  <ProfitPercentageText isProfit={isProfit}>
                    {profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}% {isProfit ? "📈" : "📉"}
                  </ProfitPercentageText>
                </>
              )}
            </ProfitSection>
          </HeroContent>
        </HeroSection>

        {/* Bottom section with trade details */}
        <BottomSection>
          <DetailsSection>
            <DetailRow>
              <DetailLabel>Entry Price:</DetailLabel>
              <DetailValue>{entryPrice}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Exit Price:</DetailLabel>
              <DetailValue>{currentPrice}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Duration:</DetailLabel>
              <DetailValue>{duration}</DetailValue>
            </DetailRow>
          </DetailsSection>

          {/* Branding */}
          <BrandingSection>
            <BrandingText>Trade on overlay.market</BrandingText>
          </BrandingSection>
        </BottomSection>
      </ShareCardContainer>
    );
  }
);

ShareCard.displayName = "ShareCard";

export default ShareCard;