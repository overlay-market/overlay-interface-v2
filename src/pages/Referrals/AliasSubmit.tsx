import { useEffect, useState } from "react";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../components/Button";
import { Flex, Text } from "@radix-ui/themes";
import {
  ContentContainer,
  GradientText,
  StyledInput,
} from "./referrals-styles";
import theme from "../../theme";
import useDebounce from "../../hooks/useDebounce";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";
import { useAccount, useSignTypedData } from "wagmi";
import { isAddress } from "viem";
import { CopyGradientIcon } from "../../assets/icons/svg-icons";
import { CopyLink, Toast } from "./alias-submit-styles";
import { useLocation } from "react-router-dom";

type AliasSubmitProps = {
  alias: string | null;
};

const AliasSubmit: React.FC<AliasSubmitProps> = ({ alias }) => {
  const { address: affiliateAddress } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const location = useLocation();

  const [aliasValue, setAliasValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [registeringAlias, setRegisteringAlias] = useState(false);
  const [succeededToSubmit, setSucceededToSubmit] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [registeredAlias, setRegisteredAlias] = useState(alias);
  const debouncedAliasValue = useDebounce(aliasValue, 500);

  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [debouncedAliasValue]);

  useEffect(() => {
    const regex = /^[a-zA-Z0-9]{3,8}$/;
    if (debouncedAliasValue !== "") {
      if (!regex.test(debouncedAliasValue)) {
        setErrorMessage("Input must be 3-8 alphanumeric characters");
      } else {
        setErrorMessage(null);
        checkAliasAvailability(debouncedAliasValue.toLowerCase());
      }
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

  // EIP 712 signature data
  const domain = {
    name: "Overlay Referrals",
    version: "1.0",
  };
  const types = {
    SetAlias: [
      { name: "affiliate", type: "address" },
      { name: "alias", type: "string" },
    ],
  };
  const primaryType = "SetAlias";

  const fetchSignature = async (affiliate: string, alias: string) => {
    setFetchingSignature(true);
    let signature;
    try {
      signature = await signTypedDataAsync({
        domain,
        types,
        primaryType,
        message: { affiliate, alias },
      });
    } catch (error) {
      const errorWithDetails = error as { details?: string };
      if (errorWithDetails?.details) {
        setErrorMessage(`${errorWithDetails.details}`);
      } else {
        setErrorMessage("unable to get error, see console");
      }
      console.error("Error fetching signature:", error);
    } finally {
      setFetchingSignature(false);
    }
    return signature;
  };

  const registerAlias = async (
    signature: string,
    affiliate: string,
    alias: string
  ) => {
    setRegisteringAlias(true);
    try {
      const response = await fetch(
        REFERRAL_API_BASE_URL + `/affiliates/aliases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: affiliate,
            alias,
            signature,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(
          `Failed to register alias: ${
            result?.message ?? "Unable to get error message"
          }`
        );
        throw new Error(`Failed to register alias: ${JSON.stringify(result)}`);
      }

      const result = await response.json();

      if (result.alias && result.createdAt) {
        setSucceededToSubmit(true);
        setRegisteredAlias(result.alias);
      }
    } catch (error) {
      console.error("Error registering alias:", error);
    } finally {
      setRegisteringAlias(false);
    }
  };

  const handleAliasConfirm = async () => {
    if (!affiliateAddress || !debouncedAliasValue) return;
    if (!isAddress(affiliateAddress)) {
      setErrorMessage("Invalid affiliate address");
      return;
    }
    const signature = await fetchSignature(
      affiliateAddress.toLowerCase(),
      debouncedAliasValue.toLowerCase()
    );
    signature &&
      (await registerAlias(
        signature,
        affiliateAddress.toLowerCase(),
        debouncedAliasValue.toLowerCase()
      ));
    setSuccessMessage(null);
  };

  const showToast = (duration = 3000) => {
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, duration);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${
        location.pathname
      }?referrer=${registeredAlias?.toLowerCase()}`
    );
    showToast();
  };

  return (
    <>
      {!succeededToSubmit && (
        <>
          {alias && (
            <ContentContainer>
              <Flex direction={"column"} align={"center"} gap="8px">
                <Text weight={"medium"}>Your affiliate alias is active</Text>
                <GradientText weight={"medium"} size={"4"}>
                  {alias.toUpperCase()}
                </GradientText>
                <Flex gap={"8px"}>
                  <Text weight={"medium"}>Copy referral link</Text>
                  <CopyLink onClick={handleCopyLink}>
                    <CopyGradientIcon />
                  </CopyLink>
                  <Toast visible={toastVisible.toString()}>
                    Link copied to clipboard
                  </Toast>
                </Flex>
              </Flex>
            </ContentContainer>
          )}
          {!alias && (
            <ContentContainer height={debouncedAliasValue && "276px"}>
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
                  disabled={fetchingSignature || registeringAlias}
                  value={aliasValue.toUpperCase()}
                  onChange={(e) => setAliasValue(e.target.value.trim())}
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

              {successMessage &&
                (fetchingSignature || registeringAlias ? (
                  <GradientLoaderButton
                    title={"Processing ..."}
                    height={"49px"}
                  />
                ) : (
                  <GradientSolidButton
                    title={"Sign and Confirm Alias"}
                    height={"49px"}
                    handleClick={handleAliasConfirm}
                  />
                ))}
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
            <Text weight={"medium"} size="3" align={"center"}>
              Alias{" "}
              <GradientText weight={"medium"}>
                {registeredAlias?.toUpperCase()}
              </GradientText>{" "}
              has been successfully registered!
            </Text>
          </Flex>
          <Flex gap={"8px"}>
            <Text weight={"medium"}>Copy referral link</Text>
            <CopyLink onClick={handleCopyLink}>
              <CopyGradientIcon />
            </CopyLink>
            <Toast visible={toastVisible.toString()}>
              Link copied to clipboard
            </Toast>
          </Flex>
        </ContentContainer>
      )}
    </>
  );
};

export default AliasSubmit;
