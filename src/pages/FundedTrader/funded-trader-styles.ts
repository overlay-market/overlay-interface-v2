import styled from 'styled-components';
import { Flex, Box, Text } from '@radix-ui/themes';
import theme from '../../theme';

export const FundedTraderWrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

// Hero Section
export const HeroSection = styled(Flex)`
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px 16px;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 32px 32px 24px;
    gap: 16px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 48px 48px 32px;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.color.white};
  margin: 0;
  line-height: 1.2;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 40px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 48px;
  }
`;

export const HeroSubtitle = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.4;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 18px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 20px;
  }
`;

// Program Card - Gradient border with tier color
export const ProgramCardContainer = styled(Box)<{
  $accentColor: string;
  $isLocked: boolean
}>`
  width: 280px;
  min-height: 480px;
  border-radius: 16px;
  border: 1px solid transparent;
  padding: 20px;
  background: ${({ $isLocked, $accentColor }) =>
    $isLocked
      ? `linear-gradient(${theme.color.grey7}, ${theme.color.grey7}) padding-box,
         linear-gradient(135deg, ${theme.color.grey10} 0%, ${theme.color.grey11} 100%) border-box`
      : `linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
         linear-gradient(135deg, ${$accentColor} 0%,
         ${theme.color.white}20 100%) border-box`
  };

  box-shadow: ${({ $accentColor, $isLocked }) =>
    $isLocked
      ? '0px 4px 12px rgba(0, 0, 0, 0.3)'
      : `0px 4px 24px ${$accentColor}40, 0px 0px 4px ${theme.color.white}20 inset`
  };

  opacity: ${({ $isLocked }) => $isLocked ? 0.6 : 1};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 320px;
    padding: 24px;
    min-height: 520px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: 340px;
  }
`;

export const CardEmojiIndicator = styled.div`
  font-size: 36px;
  margin-bottom: 8px;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 40px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 48px;
  }
`;

export const CardTierName = styled.h3<{ $accentColor: string }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ $accentColor }) => $accentColor};
  margin: 0 0 4px 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 28px;
  }
`;

export const CardSection = styled(Flex)`
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  background: ${theme.color.grey4}40;
  border: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: 8px;
    padding: 16px;
  }
`;

export const CardSectionTitle = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${theme.color.grey3};
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const CardDetailRow = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

export const CardDetailLabel = styled(Text)`
  font-size: 13px;
  color: ${theme.color.grey3};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

export const CardDetailValue = styled(Text)`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.color.white};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

// Carousel Section
export const CarouselSection = styled(Box)`
  padding: 24px 0 32px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 32px 0 48px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 40px 0 56px;
  }
`;

export const CarouselWrapper = styled(Box)`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;

  .swiper {
    width: 100%;
  }

  /* Center carousel when all 5 cards fit horizontally
     Calculated: 5 cards × 340px + 4 gaps × 12px + padding ≈ 1780px
     Using 1900px (below theme.breakpoints.xxl of 1920px) to provide buffer */
  @media (min-width: 1900px) {
    justify-content: center;

    .swiper {
      width: auto;
      max-width: fit-content;
    }
  }
`;

export const SectionTitle = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.color.grey3};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding: 0 16px;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    margin-bottom: 16px;
    padding: 0 32px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 16px;
    margin-bottom: 20px;
    padding: 0 48px;
  }
`;

// Important Notice
export const NoticeBox = styled(Flex)`
  margin: 24px 16px 32px;
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  background: ${theme.color.grey4}40;
  border: 1px solid ${theme.color.yellow1}60;
  border-left: 4px solid ${theme.color.yellow1};
  max-width: 900px;

  @media (min-width: ${theme.breakpoints.sm}) {
    margin: 32px 32px 48px;
    padding: 20px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    margin: 40px auto 56px;
    padding: 24px;
  }
`;
