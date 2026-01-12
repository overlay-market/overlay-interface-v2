import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import { ProgramTier } from "./types";
import { TIER_COLORS } from "../../constants/funded-trader";
import { GradientOutlineButton } from "../../components/Button";
import theme from "../../theme";
import {
  ProgramCardContainer,
  CardEmojiIndicator,
  CardTierName,
  CardSection,
  CardSectionTitle,
  CardDetailRow,
  CardDetailLabel,
  CardDetailValue,
} from "./funded-trader-styles";

interface ProgramCardProps {
  tier: ProgramTier;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ tier }) => {
  const colorScheme = TIER_COLORS[tier.colorAccent];

  return (
    <ProgramCardContainer
      $accentColor={colorScheme.primary}
      $isLocked={tier.isLocked}
    >
      <Flex direction="column" gap="16px">
        {/* Header */}
        <Flex direction="column" gap="4px">
          <CardEmojiIndicator>{tier.emoji}</CardEmojiIndicator>
          <CardTierName $accentColor={colorScheme.primary}>
            {tier.tierName}
          </CardTierName>
          <Flex direction="column" gap="4px" mt="8px">
            <Text size="1" style={{ color: theme.color.grey3 }}>
              GET FUNDED
            </Text>
            <Text
              size={{ initial: "5", sm: "6" }}
              weight="bold"
              style={{ color: theme.color.white }}
            >
              ${tier.fundedAmount.toLocaleString()}
            </Text>
          </Flex>
        </Flex>

        {/* To Pass Section */}
        <CardSection>
          <CardSectionTitle>TO PASS</CardSectionTitle>
          <CardDetailRow>
            <CardDetailLabel>Trade</CardDetailLabel>
            <CardDetailValue>
              {tier.requirements.volumeRequired} volume
            </CardDetailValue>
          </CardDetailRow>
          <CardDetailRow>
            <CardDetailLabel>Reach</CardDetailLabel>
            <CardDetailValue>
              {tier.requirements.profitTarget} profit
            </CardDetailValue>
          </CardDetailRow>
          <CardDetailRow>
            <CardDetailLabel>Minimum Days</CardDetailLabel>
            <CardDetailValue>
              {tier.requirements.minimumTradingDays}
            </CardDetailValue>
          </CardDetailRow>
          <CardDetailRow>
            <CardDetailLabel>Time Limit</CardDetailLabel>
            <CardDetailValue>{tier.requirements.timeLimit}</CardDetailValue>
          </CardDetailRow>
        </CardSection>

        {/* After Passing Section */}
        <CardSection>
          <CardSectionTitle>AFTER PASSING</CardSectionTitle>
          <CardDetailRow>
            <CardDetailLabel>Keep</CardDetailLabel>
            <CardDetailValue>
              {tier.afterPassing.profitSplit} of profits
            </CardDetailValue>
          </CardDetailRow>
          <CardDetailRow>
            <CardDetailLabel>Payouts</CardDetailLabel>
            <CardDetailValue>
              every {tier.afterPassing.payoutFrequency}
            </CardDetailValue>
          </CardDetailRow>
          <CardDetailRow>
            <CardDetailLabel>Daily max loss</CardDetailLabel>
            <CardDetailValue>{tier.afterPassing.dailyMaxLoss}</CardDetailValue>
          </CardDetailRow>
          <CardDetailRow>
            <CardDetailLabel>Max total loss</CardDetailLabel>
            <CardDetailValue>{tier.afterPassing.maxTotalLoss}</CardDetailValue>
          </CardDetailRow>
        </CardSection>

        {/* Button */}
        <GradientOutlineButton
          title="Coming Soon"
          width="100%"
          height="44px"
          isDisabled={true}
        />
      </Flex>
    </ProgramCardContainer>
  );
};

export default ProgramCard;
