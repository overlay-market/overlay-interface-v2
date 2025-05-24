import { Flex, Text } from "@radix-ui/themes";
import {
  GradientLoaderButton,
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

type ReferralsModalProps = {
  referralCodeFromURL: string | null;
  open: boolean;
  triggerRefetch: Function;
  handleDismiss: () => void;
};

const ReferralModal: React.FC<ReferralsModalProps> = ({
  referralCodeFromURL,
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (referralCodeFromURL) {
      setReferralCode(referralCodeFromURL);
    }
  }, [referralCodeFromURL]);

  useEffect(() => {
    setError(null);
  }, [referralCode, walletAddress]);

  const fetchMessageToSign = useCallback(async () => {
    setError(null);
    if (!walletAddress || !referralCode) {
      return;
    }

    try {
      const url = new URL("/points-bsc/referral/message-to-sign", REFERRAL_API_BASE_URL);
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
      }

      const { messageToSign } = data;
      setMessageToSign(messageToSign);
      return messageToSign;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch message.");
      return null;
    }
  }, [walletAddress, referralCode]);

  const signReferralMessage = async (message?: string): Promise<`0x${string}` | null> => {
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
      const url = new URL("/points-bsc/referral/use-referral-code", REFERRAL_API_BASE_URL);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to submit referral.");
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

  return (
    <Modal triggerElement={null} open={open} handleClose={handleDismiss}>
      <ContentContainer>
        <Text size={{ initial: "2", sm: "4" }} weight={"bold"} align={"center"}>
          Referral code
        </Text>

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
      </ContentContainer>
    </Modal>
  );
};

export default ReferralModal;
