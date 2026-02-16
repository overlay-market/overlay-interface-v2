import { Flex, Text } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { CheckCircle, X, XCircle } from "react-feather";
import * as Dialog from "@radix-ui/react-dialog";
import { GradientSolidButton } from "../../Button";
import theme from "../../../theme";
import ShareCard from "./ShareCard";
import { captureShareCard, downloadImage, shareToTwitterWithImage } from "../../../utils/shareUtils";
import { OpenPositionData, UnwindStateSuccess } from "overlay-sdk";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import {
  CelebrationContainer,
  ProfitBadge,
  ShareCardWrapper,
  ButtonGroup,
  ShareModalOverlay,
  ShareModalContent,
  ShareModalClose,
  ProfitDisplayControl,
  ProfitDisplayOption,
  ProfitDisplayLabel,
} from "./share-success-styles";

type ProfitDisplayMode = 'absolute' | 'percentage' | 'both';

type ShareSuccessProps = {
  open: boolean;
  position: OpenPositionData;
  unwindState: UnwindStateSuccess;
  unwindPercentage: number;
  transactionHash?: string;
  handleDismiss: () => void;
};

const ShareSuccess: React.FC<ShareSuccessProps> = ({
  open,
  position,
  unwindState,
  unwindPercentage: _unwindPercentage, // Not needed anymore since SDK provides correct PnL
  transactionHash,
  handleDismiss,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [profitDisplayMode, setProfitDisplayMode] = useState<ProfitDisplayMode>('both');
  const [showClipboardSuccess, setShowClipboardSuccess] = useState(false);
  const [preRenderedDataUrl, setPreRenderedDataUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Pre-render the share card when the modal opens (and when profitDisplayMode changes)
  // so that navigator.share() can be called almost immediately after tap (preserving iOS gesture token)
  useEffect(() => {
    if (open) {
      setShowClipboardSuccess(false);
      setShareError(null);
      // Small delay to allow the card to render in the DOM first
      const timer = setTimeout(() => {
        if (shareCardRef.current) {
          captureShareCard(shareCardRef.current)
            .then((dataUrl) => setPreRenderedDataUrl(dataUrl))
            .catch((err) => console.warn('Pre-render failed, will capture on demand:', err));
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPreRenderedDataUrl(null);
    }
  }, [open, profitDisplayMode]);

  // Auto-clear share error after 5 seconds
  useEffect(() => {
    if (shareError) {
      const timer = setTimeout(() => setShareError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [shareError]);

  // Detect LBSC (USDT-collateralized) position
  const isLbscPosition = !!position.loan?.id;
  const tokenLabel = isLbscPosition ? "USDT" : "OVL";

  // Fix SDK bug: SDK returns full position PnL instead of fractional PnL
  // Calculate the actual PnL for the unwound portion
  const fullPnL = unwindState.pnl ? Number(unwindState.pnl) : 0;
  const fullValue = unwindState.value ? Number(unwindState.value) : 0;
  const fractionValue = unwindState.fractionValue ? Number(unwindState.fractionValue) : 0;

  // Calculate fractional PnL in OVL: (fractionValue / fullValue) * fullPnL
  const profitOVL = fullValue > 0 ? (fractionValue / fullValue) * fullPnL : fullPnL;

  // For LBSC positions, use SDK-computed USDT PnL from position data.
  // This uses the correct dual-formula: oracle price for gains, loan ratio for losses.
  // We cannot derive it from unwindState.stableValues because value uses current oracle
  // price while initialCollateral/debt use the original loan ratio (different conversion rates).
  let profitAmount: number;
  if (isLbscPosition && position.stableValues?.unrealizedPnL) {
    profitAmount = Number(position.stableValues.unrealizedPnL);
  } else {
    profitAmount = profitOVL;
  }

  // Calculate percentage return: (profit / initial_investment) * 100
  // For LBSC positions, use USDT values since that's the user's actual investment.
  // OVL-based percentage would be wrong because OVL/USDT rate changes over time.
  let profitPercentage: number;
  if (isLbscPosition && position.stableValues?.initialCollateral) {
    const initialCollateralUSDT = Number(position.stableValues.initialCollateral);
    profitPercentage = initialCollateralUSDT > 0 ? (profitAmount / initialCollateralUSDT) * 100 : 0;
  } else {
    const initialInvestment = fractionValue - profitOVL;
    profitPercentage = initialInvestment > 0 ? (profitOVL / initialInvestment) * 100 : 0;
  }
  const isProfit = profitAmount > 0;
  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];

  const handleCaptureAndDownload = async () => {
    if (!shareCardRef.current) return;

    setIsCapturing(true);
    setShareError(null);
    try {
      const dataUrl = preRenderedDataUrl ?? await captureShareCard(shareCardRef.current);
      downloadImage(dataUrl, `overlay-trade-${position.marketName}-${Date.now()}.png`);

      // Track share card download event
      console.log("Share Card Downloaded", {
        marketName: position.marketName,
        profitOVL,
        profitPercentage,
        transactionHash,
      });
    } catch (error) {
      console.error("Failed to capture and download image:", error);
      setShareError("Failed to generate image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShareToTwitter = async () => {
    if (!shareCardRef.current) return;

    setIsCapturing(true);
    setShareError(null);
    try {
      // Use pre-rendered image if available, otherwise capture on demand
      const dataUrl = preRenderedDataUrl ?? await captureShareCard(shareCardRef.current);

      const tweetText = isProfit
        ? `Just made ${profitAmount.toFixed(2)} ${tokenLabel} (${profitPercentage.toFixed(1)}%) profit on ${position.marketName} 🚀\n\nTrade on overlay.market`
        : `Diamond hands on ${position.marketName}! ${profitAmount.toFixed(2)} ${tokenLabel} (${profitPercentage.toFixed(1)}%) 💎🙌\n\nTrade on overlay.market`;

      // Share with image using Web Share API or clipboard
      const result = await shareToTwitterWithImage(
        tweetText,
        dataUrl,
        `overlay-trade-${position.marketName}-${Date.now()}.png`
      );

      // Show inline feedback for clipboard copy on desktop
      if (result.method === 'clipboard' && result.success) {
        setShowClipboardSuccess(true);
      }

      if (!result.success) {
        setShareError("Sharing failed. Please try downloading the image instead.");
      }

      // Track share event
      console.log("Share Card Shared", {
        marketName: position.marketName,
        profitOVL,
        profitPercentage,
        transactionHash,
        method: result.method,
        success: result.success
      });
    } catch (error) {
      console.error("Failed to share:", error);
      setShareError("Failed to share. Please try downloading the image instead.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleDismiss();
    }
  };

  const renderModalContent = () => {
    if (isDesktop) {
      // Desktop: Horizontal layout
      return (
        <Flex direction="row" width="100%" align="center" gap="20px">
          {/* Left side: Shareable Card */}
          <ShareCardWrapper>
            <ShareCard
              ref={shareCardRef}
              position={position}
              unwindState={unwindState}
              profitOVL={profitAmount}
              profitPercentage={profitPercentage}
              positionSide={positionSide}
              positionLeverage={positionLeverage}
              profitDisplayMode={profitDisplayMode}
              isProfit={isProfit}
              tokenLabel={tokenLabel}
            />
          </ShareCardWrapper>

          {/* Right side: Success message and controls */}
          <Flex direction="column" align="center" gap="20px" style={{ flex: 1 }}>
            <CelebrationContainer>
              <Flex direction="column" align="center" gap="12px">
                {isProfit ? (
                  <CheckCircle size={48} color={theme.color.green1} />
                ) : (
                  <XCircle size={48} color="#dc2626" />
                )}
                <Text
                  style={{
                    color: isProfit ? theme.color.green1 : "#dc2626",
                    fontWeight: "700",
                    fontSize: "24px",
                    textAlign: "center",
                  }}
                >
                  {isProfit ? "🎉 Nice Trade!" : "💪 Better Luck Next Time!"}
                </Text>
                <ProfitBadge isProfit={isProfit}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {profitAmount >= 0 ? "+" : ""}{profitAmount.toFixed(2)} {tokenLabel} ({profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}%)
                  </Text>
                </ProfitBadge>
              </Flex>
            </CelebrationContainer>

            {/* Profit Display Controls */}
            <div style={{ width: "100%" }}>
              <ProfitDisplayLabel>Show on card:</ProfitDisplayLabel>
              <ProfitDisplayControl>
                <ProfitDisplayOption
                  isActive={profitDisplayMode === 'absolute'}
                  onClick={() => setProfitDisplayMode('absolute')}
                >
                  {tokenLabel}
                </ProfitDisplayOption>
                <ProfitDisplayOption
                  isActive={profitDisplayMode === 'percentage'}
                  onClick={() => setProfitDisplayMode('percentage')}
                >
                  %
                </ProfitDisplayOption>
                <ProfitDisplayOption
                  isActive={profitDisplayMode === 'both'}
                  onClick={() => setProfitDisplayMode('both')}
                >
                  Both
                </ProfitDisplayOption>
              </ProfitDisplayControl>
            </div>

            {/* Clipboard success message */}
            {showClipboardSuccess && (
              <div style={{ width: "100%", padding: "0 24px" }}>
                <div style={{
                  padding: "10px 12px",
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#22c55e"
                }}>
                  <CheckCircle size={16} color="#22c55e" />
                  <span>Image copied! Paste it in your tweet (Ctrl+V / Cmd+V)</span>
                </div>
              </div>
            )}

            {/* Share error message */}
            {shareError && (
              <div style={{ width: "100%", padding: "0 24px" }}>
                <div style={{
                  padding: "10px 12px",
                  background: "rgba(220, 38, 38, 0.1)",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#ef4444"
                }}>
                  <XCircle size={16} color="#ef4444" />
                  <span>{shareError}</span>
                </div>
              </div>
            )}

            <ButtonGroup>
              <GradientSolidButton
                title={isCapturing ? "Generating..." : (isDesktop ? "Share on X" : "Share")}
                width="100%"
                height="46px"
                handleClick={handleShareToTwitter}
                isDisabled={isCapturing}
              />

              <GradientSolidButton
                title={isCapturing ? "Generating..." : "Download Image"}
                width="100%"
                height="46px"
                handleClick={handleCaptureAndDownload}
                isDisabled={isCapturing}
              />
            </ButtonGroup>
          </Flex>
        </Flex>
      );
    }

    // Mobile: Vertical layout (original)
    return (
      <Flex direction="column" width="100%" align="center" gap="24px">
        {/* Success Header */}
        <CelebrationContainer>
          <Flex direction="column" align="center" gap="12px" mt="24px">
            {isProfit ? (
              <CheckCircle size={48} color={theme.color.green1} />
            ) : (
              <XCircle size={48} color="#dc2626" />
            )}
            <Text
              style={{
                color: isProfit ? theme.color.green1 : "#dc2626",
                fontWeight: "700",
                fontSize: "24px",
                textAlign: "center",
              }}
            >
              {isProfit ? "🎉 Nice Trade!" : "💪 Better Luck Next Time!"}
            </Text>
            <ProfitBadge isProfit={isProfit}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                {profitAmount >= 0 ? "+" : ""}{profitAmount.toFixed(2)} {tokenLabel} ({profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}%)
              </Text>
            </ProfitBadge>
          </Flex>
        </CelebrationContainer>

        {/* Shareable Card */}
        <ShareCardWrapper>
          <ShareCard
            ref={shareCardRef}
            position={position}
            unwindState={unwindState}
            profitOVL={profitAmount}
            profitPercentage={profitPercentage}
            positionSide={positionSide}
            positionLeverage={positionLeverage}
            profitDisplayMode={profitDisplayMode}
            isProfit={isProfit}
            tokenLabel={tokenLabel}
          />
        </ShareCardWrapper>

        {/* Profit Display Controls */}
        <div style={{ width: "100%" }}>
          <ProfitDisplayLabel>Show on card:</ProfitDisplayLabel>
          <ProfitDisplayControl>
            <ProfitDisplayOption
              isActive={profitDisplayMode === 'absolute'}
              onClick={() => setProfitDisplayMode('absolute')}
            >
              {tokenLabel}
            </ProfitDisplayOption>
            <ProfitDisplayOption
              isActive={profitDisplayMode === 'percentage'}
              onClick={() => setProfitDisplayMode('percentage')}
            >
              %
            </ProfitDisplayOption>
            <ProfitDisplayOption
              isActive={profitDisplayMode === 'both'}
              onClick={() => setProfitDisplayMode('both')}
            >
              Both
            </ProfitDisplayOption>
          </ProfitDisplayControl>
        </div>

        {/* Clipboard success message */}
        {showClipboardSuccess && (
          <div style={{ width: "100%", padding: "0 24px" }}>
            <div style={{
              padding: "10px 12px",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#22c55e"
            }}>
              <CheckCircle size={16} color="#22c55e" />
              <span>Image copied! Paste it in your tweet (Ctrl+V / Cmd+V)</span>
            </div>
          </div>
        )}

        {/* Share error message */}
        {shareError && (
          <div style={{ width: "100%", padding: "0 24px" }}>
            <div style={{
              padding: "10px 12px",
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#ef4444"
            }}>
              <XCircle size={16} color="#ef4444" />
              <span>{shareError}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <ButtonGroup>
          <GradientSolidButton
            title={isCapturing ? "Generating..." : (isDesktop ? "Share on X" : "Share")}
            width="100%"
            height="46px"
            handleClick={handleShareToTwitter}
            isDisabled={isCapturing}
          />

          <GradientSolidButton
            title={isCapturing ? "Generating..." : "Download Image"}
            width="100%"
            height="46px"
            handleClick={handleCaptureAndDownload}
            isDisabled={isCapturing}
          />
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <ShareModalOverlay />
        <ShareModalContent isDesktop={isDesktop}>
          {renderModalContent()}

          <ShareModalClose asChild>
            <X size={24} />
          </ShareModalClose>
        </ShareModalContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareSuccess;