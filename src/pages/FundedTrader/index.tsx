import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import {
  FundedTraderWrapper,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  NoticeBox,
} from "./funded-trader-styles";
import { LineSeparator } from "../../styles/shared-styles";
import ProgramCarousel from "./ProgramCarousel";
import { IMPORTANT_NOTICE } from "../../constants/funded-trader";
import theme from "../../theme";

const FundedTrader: React.FC = () => {
  const headerSize = theme.headerSize.height;

  return (
    <FundedTraderWrapper>
      {/* Header - tablet+ only */}
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align="center"
        height={headerSize}
        px="10px"
      >
        <Text size="2" weight="medium">
          Funded Trader Program
        </Text>
      </Flex>

      <LineSeparator />

      {/* Main Content */}
      <Flex direction="column" width="100%" style={{ overflowY: "auto" }}>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle>Funded Trader Program</HeroTitle>
          <HeroSubtitle>
            Pass the Test · Get Funded · Keep 80% of the Profits
          </HeroSubtitle>
        </HeroSection>

        {/* Program Carousel */}
        <ProgramCarousel />

        {/* Important Notice */}
        <NoticeBox>
          <Text size="2" weight="medium" style={{ color: theme.color.white }}>
            ⚠️ Important
          </Text>
          <Text size="2" style={{ color: theme.color.grey3 }}>
            {IMPORTANT_NOTICE}
          </Text>
        </NoticeBox>
      </Flex>
    </FundedTraderWrapper>
  );
};

export default FundedTrader;
