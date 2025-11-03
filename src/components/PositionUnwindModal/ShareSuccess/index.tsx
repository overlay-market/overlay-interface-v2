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
import { useAddPopup } from "../../../state/application/hooks";
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
  const shareCardRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const addPopup = useAddPopup();

  // Preload html2canvas when modal opens to avoid first-click delay
  useEffect(() => {
    if (open) {
      import("html2canvas");
    }
  }, [open]);

  // Fix SDK bug: SDK returns full position PnL instead of fractional PnL
  // Calculate the actual PnL for the unwound portion
  const fullPnL = unwindState.pnl ? Number(unwindState.pnl) : 0;
  const fullValue = unwindState.value ? Number(unwindState.value) : 0;
  const fractionValue = unwindState.fractionValue ? Number(unwindState.fractionValue) : 0;

  // Calculate fractional PnL: (fractionValue / fullValue) * fullPnL
  const profitOVL = fullValue > 0 ? (fractionValue / fullValue) * fullPnL : fullPnL;

  // Calculate percentage return: (profit / initial_investment) * 100
  // Initial investment for unwound portion = fraction_value - profit
  const initialInvestment = fractionValue - profitOVL;
  const profitPercentage = initialInvestment > 0 ? (profitOVL / initialInvestment) * 100 : 0;
  const isProfit = profitOVL > 0;
  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];

  const handleCaptureAndDownload = async () => {
    if (!shareCardRef.current) return;

    setIsCapturing(true);
    try {
      const dataUrl = await captureShareCard(shareCardRef.current);
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
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShareToTwitter = async () => {
    if (!shareCardRef.current) return;

    setIsCapturing(true);
    try {
      // Capture the share card as image
      const dataUrl = await captureShareCard(shareCardRef.current);

      const tweetText = isProfit
        ? `Just made ${profitOVL.toFixed(2)} OVL (${profitPercentage.toFixed(1)}%) profit on ${position.marketName} 🚀\n\nTrade on overlay.market`
        : `Diamond hands on ${position.marketName}! ${profitOVL.toFixed(2)} OVL (${profitPercentage.toFixed(1)}%) 💎🙌\n\nTrade on overlay.market`;

      // Share with image using Web Share API or clipboard
      const result = await shareToTwitterWithImage(
        tweetText,
        dataUrl,
        `overlay-trade-${position.marketName}-${Date.now()}.png`
      );

      // Show feedback for clipboard copy on desktop
      if (result.method === 'clipboard' && result.success) {
        addPopup({
          txn: {
            hash: Date.now().toString(),
            success: true,
            message: "Image copied! Paste it in your tweet (Ctrl+V / Cmd+V)",
            type: "CLIPBOARD_COPY"
          }
        }, Date.now().toString());
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
              profitOVL={profitOVL}
              profitPercentage={profitPercentage}
              positionSide={positionSide}
              positionLeverage={positionLeverage}
              profitDisplayMode={profitDisplayMode}
              isProfit={isProfit}
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
                    {profitOVL >= 0 ? "+" : ""}{profitOVL.toFixed(2)} OVL ({profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}%)
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
                  OVL
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
                {profitOVL >= 0 ? "+" : ""}{profitOVL.toFixed(2)} OVL ({profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}%)
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
            profitOVL={profitOVL}
            profitPercentage={profitPercentage}
            positionSide={positionSide}
            positionLeverage={positionLeverage}
            profitDisplayMode={profitDisplayMode}
            isProfit={isProfit}
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
              OVL
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