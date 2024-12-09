import { useEffect, useState } from "react";
import { GradientSolidButton } from "../../components/Button";
import { Flex, Text } from "@radix-ui/themes";
import {
  ContentContainer,
  GradientText,
  StyledInput,
} from "./referrals-styles";
import theme from "../../theme";
import useDebounce from "../../hooks/useDebounce";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

type AliasSubmitProps = {
  alias: string | null;
};

const AliasSubmit: React.FC<AliasSubmitProps> = ({ alias }) => {
  const [aliasValue, setAliasValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [succeededToSubmit, setSucceededToSubmit] = useState(false);

  const debouncedAliasValue = useDebounce(aliasValue, 500);

  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [aliasValue]);

  useEffect(() => {
    const regex = /^[a-zA-Z0-9]{3,8}$/;
    if (!regex.test(debouncedAliasValue) && debouncedAliasValue !== "") {
      setErrorMessage("Input must be 3-8 alphanumeric characters");
    } else {
      setErrorMessage(null);
      checkAliasAvailability(debouncedAliasValue);
    }
  }, [debouncedAliasValue]);

  const checkAliasAvailability = async (alias: string) => {
    try {
      const response = await fetch(
        REFERRAL_API_BASE_URL + `/affiliates/aliases/${alias}`
      );
      if (response.status === 404) {
        setSuccessMessage("Alias is available! Please sign to confirm");
      }
      if (response.status === 200 && alias !== "") {
        setErrorMessage("Alias is already taken");
      }
    } catch (error) {
      console.error("Error checking alias availability", error);
    }
  };

  return (
    <>
      {!succeededToSubmit && (
        <>
          {alias && (
            <ContentContainer>
              <Flex direction={"column"} align={"center"} gap="8px">
                <Text weight={"medium"}>Your affiliate alias is active!</Text>
                <Text weight={"medium"}>
                  Your alias:{" "}
                  <GradientText weight={"medium"}>{alias}</GradientText>
                </Text>
                <Text weight={"medium"}>Your referral link</Text>
              </Flex>
            </ContentContainer>
          )}
          {!alias && (
            <ContentContainer height={"276px"}>
              <Text
                size={{ initial: "2", sm: "4" }}
                weight={"bold"}
                align={"center"}
              >
                Affiliate Alias
              </Text>

              <Flex direction={"column"} gap="8px">
                <Text
                  size={"1"}
                  style={{ paddingLeft: "16px", color: `${theme.color.grey3}` }}
                >
                  Choose a unique name to identify your affiliate profile
                </Text>
                <StyledInput
                  type="text"
                  value={aliasValue.toUpperCase()}
                  onChange={(e) => setAliasValue(e.target.value)}
                  placeholder="Enter 3-8 alphanumeric chars"
                />

                {errorMessage && (
                  <Text
                    size="1"
                    weight={"medium"}
                    style={{ color: theme.color.red1 }}
                  >
                    {errorMessage}
                  </Text>
                )}
                {successMessage && (
                  <Text
                    size="1"
                    weight={"medium"}
                    style={{ color: theme.color.green1 }}
                  >
                    {successMessage}
                  </Text>
                )}
              </Flex>

              {successMessage && (
                <GradientSolidButton
                  title="Sign and Confirm Alias"
                  height={"49px"}
                  // handleClick={handleAliasConfirm}
                />
              )}
            </ContentContainer>
          )}
        </>
      )}

      {succeededToSubmit && (
        <ContentContainer align={"center"}>
          <Text size="7">🎉</Text>
          <Text size="6" weight={"bold"}>
            Success!
          </Text>
          <Flex direction={"column"} align={"center"} gap="8px">
            <Text weight={"medium"} size="3">
              Your alias{" "}
              <GradientText weight={"medium"}>
                {debouncedAliasValue}
              </GradientText>{" "}
              has been successfully set!
            </Text>
          </Flex>
        </ContentContainer>
      )}
    </>
  );
};

export default AliasSubmit;
