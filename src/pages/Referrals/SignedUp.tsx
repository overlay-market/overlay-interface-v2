import { Flex, Text } from "@radix-ui/themes";
import { ContentContainer, GradientText } from "./referrals-styles";
import { isAddress } from "viem";
import { GradientSolidButton } from "../../components/Button";

interface SignedUpProps {
  traderSignedUpTo: string;
}

export const SignedUp: React.FC<SignedUpProps> = ({ traderSignedUpTo }) => (
  <ContentContainer>
    <Flex direction="column" align="center" gap="8px">
      <Text weight="medium" align="center">
        You are already signed up for the referral program to
      </Text>
      <GradientText weight="medium" size="4">
        {isAddress(traderSignedUpTo)
          ? traderSignedUpTo
          : traderSignedUpTo.toUpperCase()}
      </GradientText>
    </Flex>
    <GradientSolidButton title="Already Signed Up" isDisabled height="49px" />
  </ContentContainer>
);
