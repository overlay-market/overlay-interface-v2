import { Flex, Text } from "@radix-ui/themes";
import { ContentContainer, StyledInput } from "./referrals-styles";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../components/Button";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";
import { isAddress } from "viem";
import theme from "../../theme";

interface FormProps {
  affiliate: string;
  setAffiliate: (val: string) => void;
  errorMessage: string | null;
  fetchingSignature: boolean;
  postingSignature: boolean;
  traderAddress: string | undefined;
  handleSubmit: () => void;
}

export const Form: React.FC<FormProps> = ({
  affiliate,
  setAffiliate,
  errorMessage,
  fetchingSignature,
  postingSignature,
  traderAddress,
  handleSubmit,
}) => {
  const { openModal } = useModalHelper();

  return (
    <ContentContainer>
      <Text size={{ initial: "2", sm: "4" }} weight="bold" align="center">
        Affiliate Address
      </Text>
      <Flex direction="column" gap="8px">
        <StyledInput
          type="text"
          value={isAddress(affiliate) ? affiliate : affiliate.toUpperCase()}
          disabled={fetchingSignature || postingSignature}
          onChange={(e) => setAffiliate(e.target.value.trim())}
          placeholder="Enter Affiliate Address"
        />
        {errorMessage && (
          <Text size="1" weight="medium" style={{ color: theme.color.red1 }}>
            {errorMessage}
          </Text>
        )}
      </Flex>
      {!traderAddress ? (
        <GradientSolidButton
          title="Connect Wallet"
          height="49px"
          handleClick={openModal}
        />
      ) : fetchingSignature || postingSignature ? (
        <GradientLoaderButton title="Processing ..." height="49px" />
      ) : (
        <GradientSolidButton
          title="Submit"
          height="49px"
          isDisabled={affiliate === ""}
          handleClick={handleSubmit}
        />
      )}
    </ContentContainer>
  );
};
