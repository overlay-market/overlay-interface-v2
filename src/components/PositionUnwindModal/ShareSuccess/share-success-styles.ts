import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import theme from "../../../theme";

const celebrationPulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const CelebrationContainer = styled.div`
  animation: ${slideUp} 0.6s ease-out;
`;

export const ProfitBadge = styled.div<{
  isProfit?: boolean;
}>`
  background: ${({ isProfit = true }) =>
    isProfit
      ? `linear-gradient(135deg, ${theme.color.green1} 0%, #4ade80 100%)`
      : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
  };
  border-radius: 12px;
  padding: 8px 16px;
  animation: ${celebrationPulse} 2s ease-in-out infinite;
  box-shadow: ${({ isProfit = true }) =>
    isProfit
      ? '0 4px 12px rgba(34, 197, 94, 0.3)'
      : '0 4px 12px rgba(220, 38, 38, 0.3)'
  };
`;

export const ShareCardWrapper = styled.div`
  animation: ${slideUp} 0.8s ease-out 0.2s both;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.2));
`;

export const ButtonGroup = styled.div`
  animation: ${slideUp} 1s ease-out 0.4s both;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 24px;
`;

export const ShareCardContainer = styled.div`
  width: 280px;
  height: 420px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${theme.color.green1} 0%, #4ade80 100%);
  }
`;

// Top section with market image background
export const HeroSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

export const HeroBackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

export const HeroGradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(26, 26, 46, 0.85) 0%,
    rgba(22, 33, 62, 0.8) 50%,
    rgba(15, 52, 96, 0.75) 100%
  );
  z-index: 1;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const OverlayLogoImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
`;

// Bottom section for trade details
export const BottomSection = styled.div`
  background: rgba(26, 26, 46, 0.95);
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const MarketSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
`;

export const ProfitSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

export const ProfitMainText = styled.div<{
  isProfit?: boolean;
}>`
  font-size: 32px;
  font-weight: 800;
  color: ${({ isProfit = true }) =>
    isProfit ? theme.color.green1 : '#dc2626'
  };
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  letter-spacing: -0.02em;
`;

export const ProfitPercentageText = styled.div<{
  isProfit?: boolean;
}>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ isProfit = true }) =>
    isProfit ? theme.color.green1 : '#dc2626'
  };
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
`;

export const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 6px;
  margin-bottom: 12px;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.div`
  font-size: 14px;
  color: ${theme.color.blue3};
  opacity: 0.8;
`;

export const DetailValue = styled.div`
  font-size: 14px;
  color: ${theme.color.blue1};
  font-weight: 600;
`;

export const BrandingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
`;

export const BrandingText = styled.div`
  font-size: 12px;
  color: ${theme.color.blue3};
  text-align: center;
  letter-spacing: 0.5px;
`;

export const MarketNameText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
`;

export const PositionTypeText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.color.blue1};
  text-align: center;
  margin-bottom: 12px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
`;

// Loading overlay for image generation
export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 10;
`;

export const LoadingText = styled.div`
  color: ${theme.color.blue1};
  font-size: 16px;
  font-weight: 600;
`;

// Modal styles for standalone ShareSuccess modal
export const ShareModalOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  backdrop-filter: blur(7px);
`;

export const ShareModalContent = styled(Dialog.Content)<{
  isDesktop: boolean;
}>`
  background-color: ${theme.color.background};
  border-radius: 20px;
  box-sizing: border-box;
  padding: 24px;
  width: ${({ isDesktop }) => (isDesktop ? "620px" : "90%")};
  max-width: ${({ isDesktop }) => (isDesktop ? "620px" : "400px")};
  max-height: 90vh;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
  box-shadow: 0px 0px 12px 6px rgba(91, 96, 164, 0.25);
  border: 1px solid ${theme.color.blue2}80;

  @media (max-width: 767px) {
    width: 90%;
    max-width: 400px;
  }
`;

export const ProfitDisplayControl = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  gap: 2px;
  margin: 16px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ProfitDisplayOption = styled.button<{
  isActive: boolean;
}>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: ${({ isActive }) =>
    isActive
      ? `linear-gradient(135deg, ${theme.color.blue1} 0%, ${theme.color.blue2} 100%)`
      : 'transparent'
  };
  color: ${({ isActive }) =>
    isActive ? 'white' : theme.color.grey2
  };
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${({ isActive }) =>
      isActive
        ? `linear-gradient(135deg, ${theme.color.blue1} 0%, ${theme.color.blue2} 100%)`
        : 'rgba(255, 255, 255, 0.08)'
    };
    color: ${({ isActive }) =>
      isActive ? 'white' : theme.color.blue1
    };
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ProfitDisplayLabel = styled.div`
  font-size: 12px;
  color: ${theme.color.grey2};
  text-align: center;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const ShareModalClose = styled(Dialog.Close)`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  color: ${theme.color.grey2};
  background: none;
  border: none;
  outline: none;

  &:hover {
    opacity: 0.7;
  }
`;