import { Flex, Text } from "@radix-ui/themes";
import { ContentContainer, GradientText } from "./referrals-styles";
import { isAddress } from "viem";

interface SuccessProps {
  traderSignedUpTo: string;
}

export const Success: React.FC<SuccessProps> = ({ traderSignedUpTo }) => (
  <ContentContainer align="center">
    <Text size="7">🎉</Text>
    <Text size="6" weight="bold">
      Success!
    </Text>
    <Flex direction="column" align="center" gap="8px">
      <Text weight="medium" size="3">
        You signed up for the referral program to
      </Text>
      <GradientText weight="medium" size="4">
        {isAddress(traderSignedUpTo)
          ? traderSignedUpTo
          : traderSignedUpTo.toUpperCase()}
      </GradientText>
    </Flex>
  </ContentContainer>
);
