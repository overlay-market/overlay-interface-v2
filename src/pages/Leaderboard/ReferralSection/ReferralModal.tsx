import { Flex, Text } from "@radix-ui/themes";
import {
  GradientLoaderButton,
  GradientOutlineButton,
  GradientSolidButton,
} from "../../../components/Button";
import { useCallback, useEffect, useState } from "react";
import useAccount from "../../../hooks/useAccount";
import { useModalHelper } from "../../../components/ConnectWalletModal/utils";
import { useSignMessage } from "wagmi";
import { REFERRAL_API_BASE_URL } from "../../../constants/applications";
import theme from "../../../theme";
import Modal from "../../../components/Modal";
import { ContentContainer, StyledInput } from "./referral-modal-styles";
import { Link } from "react-router-dom";
import { GradientOpenInNewIcon } from "../../../assets/icons/svg-icons";
import { generateReferralCode } from "../utils/generateReferralCode";

type ReferralsModalProps = {
  referralCodeFromURL: string | null;
  isEligibleForAffiliate: boolean | undefined;
  open: boolean;
  triggerRefetch: Function;
  handleDismiss: () => void;
};

const POINTS_THRESHOLD = 10;

const ReferralModal: React.FC<ReferralsModalProps> = ({
  referralCodeFromURL,
  isEligibleForAffiliate,
  open,
  triggerRefetch,
  handleDismiss,
}) => {
  const { address: walletAddress } = useAccount();
  const { openModal } = useModalHelper();
  const { signMessageAsync } = useSignMessage();

  const [referralCode, setReferralCode] = useState("");
  const [messageToSign, setMessageToSign] = useState("");
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingCodeError, setGeneratingCodeError] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [generatingReferralCode, setGeneratingReferralCode] = useState(false);

  useEffect(() => {
    if (referralCodeFromURL) {
      setReferralCode(referralCodeFromURL);
    }
  }, [referralCodeFromURL]);

  useEffect(() => {
    setError(null);
    setGeneratingCodeError(null);
  }, [referralCode, walletAddress]);

  useEffect(() => {
    if (!open) {
      setReferralCode(referralCodeFromURL || "");
      setError(null);
    }
  }, [open]);

  const fetchMessageToSign = useCallback(async () => {
    setError(null);
    if (!walletAddress || !referralCode) {
      return;
    }

    try {
      const url = new URL(
        "/points-bsc/referral/message-to-sign",
        REFERRAL_API_BASE_URL
      );
      url.searchParams.append("walletAddress", walletAddress);
      url.searchParams.append("referralCode", referralCode);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Fetch message to sign failed");
        return undefined;
      }

      const { messageToSign } = data;
      setMessageToSign(messageToSign);
      return messageToSign;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch message.");
      return null;
    }
  }, [walletAddress, referralCode]);

  const signReferralMessage = async (
    message?: string
  ): Promise<`0x${string}` | null> => {
    try {
      const signature = await signMessageAsync({
        account: walletAddress,
        message: message ?? messageToSign,
      });
      return signature;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to sign message."
      );
      return null;
    }
  };

  const submitReferralToServer = async (sig?: `0x${string}`) => {
    try {
      const payload = {
        walletAddress,
        referralCode,
        signature: sig ?? signature,
      };
      const url = new URL(
        "/points-bsc/referral/use-referral-code",
        REFERRAL_API_BASE_URL
      );
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to submit referral.");
        return undefined;
      }

      return data;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to submit referral."
      );
      return null;
    }
  };

  const handleSignReferral = async () => {
    setError(null);
    if (!referralCode || !walletAddress) return;
    setIsLoading(true);

    try {
      const messageToSign = await fetchMessageToSign();
      if (!messageToSign) return;

      const sig = await signReferralMessage(messageToSign);
      if (!sig) return;

      if (sig) {
        setSignature(sig);
      }

      const submissionResult = await submitReferralToServer(sig);
      if (submissionResult) {
        triggerRefetch(true);
        handleDismiss();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign referral.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReferralCode = async () => {
    setGeneratingCodeError(null);
    if (!walletAddress) return;
    setGeneratingReferralCode(true);

    try {
      const result = await generateReferralCode(walletAddress);
      if (result.success) {
        triggerRefetch(true);
        handleDismiss();
      } else {
        setGeneratingCodeError(result.error ?? null);
      }
    } catch (err) {
      setGeneratingCodeError(
        err instanceof Error ? err.message : "Failed to generate referral code."
      );
    } finally {
      setGeneratingReferralCode(false);
    }
  };

  return (
    <Modal triggerElement={null} open={open} handleClose={handleDismiss}>
      <ContentContainer>
        <Text size={{ initial: "2", sm: "4" }} weight={"bold"} align={"left"}>
          Join the Referral campaign
        </Text>

        <Flex gap={"8px"}>
          <Text style={{ color: theme.color.grey3, fontSize: "14px" }}>
            For more details, follow the link
          </Text>
          <Link
            to={"https://x.com/overlayprotocol/status/1927744022271160411?s=46"}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <GradientOpenInNewIcon />
          </Link>
        </Flex>

        <Flex direction={"column"} gap={"32px"}>
          <Flex direction={"column"} gap={"16px"}>
            <Text style={{ fontSize: "14px" }}>1. Join with referral code</Text>

            <Flex direction={"column"} gap="8px">
              <StyledInput
                type="text"
                value={referralCode.toUpperCase()}
                disabled={isLoading}
                onChange={(e) => setReferralCode(e.target.value.trim())}
                placeholder="Enter referral code"
              />
            </Flex>

            {!walletAddress ? (
              <GradientSolidButton
                title="Connect Wallet"
                height={"49px"}
                handleClick={openModal}
              />
            ) : isLoading ? (
              <GradientLoaderButton title={"Processing ..."} height={"49px"} />
            ) : (
              <GradientSolidButton
                title="Sign Referral"
                height={"49px"}
                isDisabled={referralCode === ""}
                handleClick={handleSignReferral}
              />
            )}

            {error && (
              <Text style={{ color: theme.color.red1, fontSize: "12px" }}>
                {error}
              </Text>
            )}
          </Flex>

          <Flex direction={"column"} gap={"16px"}>
            <Text style={{ fontSize: "14px" }}>
              2. Create your own code (if eligible)
            </Text>

            {generatingReferralCode ? (
              <GradientLoaderButton title={"Generating..."} height={"49px"} />
            ) : isEligibleForAffiliate ? (
              <GradientSolidButton
                title={"Generate referral code"}
                height={"49px"}
                handleClick={handleGenerateReferralCode}
              />
            ) : (
              <>
                <GradientOutlineButton
                  title={"Generate referral code"}
                  height={"49px"}
                  isDisabled={true}
                />
                <Text style={{ color: theme.color.grey3, fontSize: "12px" }}>
                  You need {POINTS_THRESHOLD} points to create your code
                </Text>
              </>
            )}

            {generatingCodeError && (
              <Text style={{ color: theme.color.red1, fontSize: "12px" }}>
                {generatingCodeError}
              </Text>
            )}
          </Flex>
        </Flex>
      </ContentContainer>
    </Modal>
  );
};

export default ReferralModal;
