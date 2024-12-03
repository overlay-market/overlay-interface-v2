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

const Referrals = () => {
  const [searchParams] = useSearchParams();
  const referralAddressFromURL = searchParams.get("referrer");
  const { openModal } = useModalHelper();

  const { address: traderAddress } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [loading, setLoading] = useState(false);
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [affiliateAddress, setAffiliateAddress] = useState("");
  const [traderSignedUpTo, setTraderSignedUpTo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeededToSignUp, setSucceededToSignUp] = useState(false);

  const referralApiBaseUrl = "https://api.overlay.market/referral";

  useEffect(() => {
    if (referralAddressFromURL) {
      setAffiliateAddress(referralAddressFromURL);
    }
  }, [referralAddressFromURL]);

  useEffect(() => {
    setErrorMessage(null);
  }, [affiliateAddress]);

  // Check trader status
  const checkTraderStatus = async (address: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        referralApiBaseUrl + `/signatures/check/${address}`
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (traderAddress) {
      checkTraderStatus(traderAddress);
    }
    if (!traderAddress) {
      setAffiliateAddress("");
      setTraderSignedUpTo("");
      setSucceededToSignUp(false);
    }
  }, [traderAddress]);

  const postSignature = async (signature: string, affiliate: string) => {
    if (!traderAddress) {
      console.error("Trader address is missing");
    }

    setLoading(true);
    try {
      const response = await fetch(referralApiBaseUrl + `/signatures`, {
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
      console.log(result);
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
        <GradientBorderBox>
          {!succeededToSignUp && (
            <>
              {traderSignedUpTo && (
                <ContentContainer>
                  <Flex direction={"column"} align={"center"} gap="8px">
                    <Text weight={"medium"} align={"center"}>
                      You are already signed up for the referral program to{" "}
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
                      onChange={(e) => setAffiliateAddress(e.target.value)}
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
        </GradientBorderBox>
      </Flex>
    </Flex>
  );
};

export default Referrals;
