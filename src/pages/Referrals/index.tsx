import { useEffect, useState } from "react";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../components/Button";
import { useAccount, useSignTypedData } from "wagmi";
import { shortenAddress } from "../../utils/web3";
import { isAddress } from "viem";
import { useSearchParams } from "react-router-dom";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";
import { Flex, Text } from "@radix-ui/themes";
import {
  ContentContainer,
  GradientBorderBox,
  GradientText,
  LineSeparator,
  StyledInput,
} from "./referrals-styles";
import theme from "../../theme";
import Loader from "../../components/Loader";
import AliasSubmit from "./AliasSubmit";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

const Referrals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const referralAddressFromURL = searchParams.get("referrer");
  const { openModal } = useModalHelper();

  const { address: traderAddress, isConnecting } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [loading, setLoading] = useState(false);
  const [checkingTraderStatus, setCheckingTraderStatus] = useState(false);
  const [checkingAffiliateStatus, setCheckingAffiliateStatus] = useState(false);
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [affiliateAddress, setAffiliateAddress] = useState("");
  const [traderSignedUpTo, setTraderSignedUpTo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeededToSignUp, setSucceededToSignUp] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [alias, setAlias] = useState<string | null>(null);

  useEffect(() => {
    if (referralAddressFromURL) {
      setAffiliateAddress(referralAddressFromURL);
    }
  }, [referralAddressFromURL]);

  useEffect(() => {
    setErrorMessage(null);
  }, [affiliateAddress]);

  // Check affiliate status
  const checkAffiliateStatus = async (address: string) => {
    setCheckingAffiliateStatus(true);
    let affiliateStatus = false;
    try {
      const response = await fetch(
        REFERRAL_API_BASE_URL + `/affiliates/${address}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch affiliate status: ${response.statusText}`
        );
      }
      const { isValid, alias }: { isValid: boolean; alias: string | null } =
        await response.json();
      setIsAffiliate(isValid);
      setAlias(alias);
      affiliateStatus = isValid;
    } catch (error) {
      console.error("Error checking affiliate status:", error);
    } finally {
      setCheckingAffiliateStatus(false);
    }
    return affiliateStatus;
  };

  // Check trader status
  const checkTraderStatus = async (address: string) => {
    setCheckingTraderStatus(true);
    try {
      const response = await fetch(
        REFERRAL_API_BASE_URL + `/signatures/check/${address}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch trader status: ${response.statusText}`
        );
      }
      const { affiliate }: { exists: boolean; affiliate: string } =
        await response.json();
      setTraderSignedUpTo(affiliate);
    } catch (error) {
      console.error("Error checking trader status:", error);
    } finally {
      setCheckingTraderStatus(false);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (traderAddress) {
        const affiliateStatus = await checkAffiliateStatus(traderAddress);
        if (!affiliateStatus) {
          await checkTraderStatus(traderAddress);
        }
      } else {
        setTraderSignedUpTo("");
        setSucceededToSignUp(false);
        setIsAffiliate(false);
        setAlias(null);
      }
    };

    checkStatus();
  }, [traderAddress]);

  const postSignature = async (signature: string, affiliate: string) => {
    if (!traderAddress) {
      console.error("Trader address is missing");
    }

    setLoading(true);
    try {
      const response = await fetch(REFERRAL_API_BASE_URL + `/signatures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trader: traderAddress,
          affiliate,
          signature,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(
          `Failed to post signature: ${
            result?.message ?? "Unable to get error message"
          }`
        );
        throw new Error(`Failed to post signature: ${JSON.stringify(result)}`);
      }

      const result = await response.json();

      if (result.createdAt && result.affiliate) {
        setSucceededToSignUp(true);
        setTraderSignedUpTo(result.affiliate);
        // TODO create toast notification
      }
    } catch (error) {
      console.error("Error posting signature:", error);
    } finally {
      setLoading(false);
    }
  };

  // EIP 712 signature data
  const domain = {
    name: "Overlay Referrals",
    version: "1.0",
  };
  const types = {
    AffiliateTo: [{ name: "affiliate", type: "address" }],
  };
  const primaryType = "AffiliateTo";

  const fetchSignature = async (affiliate: string) => {
    setFetchingSignature(true);
    let signature;
    try {
      signature = await signTypedDataAsync({
        domain,
        types,
        primaryType,
        message: { affiliate },
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

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!affiliateAddress || !traderAddress) return;
    if (!isAddress(affiliateAddress)) {
      setErrorMessage("Invalid affiliate address");
      return;
    }
    const signature = await fetchSignature(affiliateAddress);
    console.log({ signature });
    signature && (await postSignature(signature, affiliateAddress));
  };

  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        justify={{ initial: "center", sm: "start" }}
        align={{ initial: "end", sm: "center" }}
        width={"100%"}
        height={theme.headerSize.height}
        px={"10px"}
      >
        <Text
          size={{ initial: "5", sm: "2" }}
          weight={{ initial: "bold", sm: "medium" }}
        >
          Referrals
        </Text>
      </Flex>
      <LineSeparator />

      <Flex
        justify={"center"}
        align={{ initial: "start", sm: "center" }}
        height={"100%"}
        pt={{ initial: "60px", sm: "0" }}
      >
        {(isConnecting || checkingAffiliateStatus || checkingTraderStatus) && (
          <GradientBorderBox>
            <ContentContainer
              align={"center"}
              justify={"center"}
              height={"224px"}
            >
              <Loader />
            </ContentContainer>
          </GradientBorderBox>
        )}
        {!isConnecting && !checkingAffiliateStatus && !checkingTraderStatus && (
          <GradientBorderBox>
            {isAffiliate ? (
              <AliasSubmit alias={alias} />
            ) : (
              <>
                {!succeededToSignUp && (
                  <>
                    {traderSignedUpTo && (
                      <ContentContainer>
                        <Flex direction={"column"} align={"center"} gap="8px">
                          <Text weight={"medium"} align={"center"}>
                            You are already signed up for the referral program
                            to{" "}
                          </Text>
                          <GradientText weight={"medium"}>
                            {shortenAddress(traderSignedUpTo, 7)}
                          </GradientText>
                        </Flex>
                        <GradientSolidButton
                          title={`Already Signed Up`}
                          isDisabled={true}
                          height={"49px"}
                        />
                      </ContentContainer>
                    )}
                    {!traderSignedUpTo && (
                      <ContentContainer>
                        <Text
                          size={{ initial: "2", sm: "4" }}
                          weight={"bold"}
                          align={"center"}
                        >
                          Affiliate Address
                        </Text>

                        <Flex direction={"column"} gap="8px">
                          <StyledInput
                            type="text"
                            value={affiliateAddress}
                            disabled={fetchingSignature || loading}
                            onChange={(e) =>
                              setAffiliateAddress(e.target.value)
                            }
                            placeholder="Enter Affiliate Address"
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
                        </Flex>

                        {!traderAddress ? (
                          <GradientSolidButton
                            title="Connect Wallet"
                            height={"49px"}
                            handleClick={openModal}
                          />
                        ) : fetchingSignature || loading ? (
                          <GradientLoaderButton
                            title={"Processing ..."}
                            height={"49px"}
                          />
                        ) : (
                          <GradientSolidButton
                            title="Submit"
                            height={"49px"}
                            isDisabled={affiliateAddress === ""}
                            handleClick={handleSubmit}
                          />
                        )}
                      </ContentContainer>
                    )}
                  </>
                )}

                {succeededToSignUp && (
                  <ContentContainer align={"center"}>
                    <Text size="7">🎉</Text>
                    <Text size="6" weight={"bold"}>
                      Success!
                    </Text>
                    <Flex direction={"column"} align={"center"} gap="8px">
                      <Text weight={"medium"} size="3">
                        You signed up for the referral program to
                      </Text>
                      <GradientText weight={"medium"}>
                        {shortenAddress(traderSignedUpTo, 7)}
                      </GradientText>
                    </Flex>
                  </ContentContainer>
                )}
              </>
            )}
          </GradientBorderBox>
        )}
      </Flex>
    </Flex>
  );
};

export default Referrals;
