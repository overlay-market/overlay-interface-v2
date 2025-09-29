import { useReferralAccountData } from "../../hooks/referrals/useReferralAccountData";
import useAccount from "../../hooks/useAccount";
import { REFERRAL_API_BASE_URL, UNIT } from "../../constants/applications";
import { Flex, Text } from "@radix-ui/themes";
import Modal from "../../components/Modal";
import theme from "../../theme";
import DetailRow from "../../components/Modal/DetailRow";
import { formatBigNumber } from "../../utils/formatBigNumber";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../components/Button";
import {
  ReferralCreateAffiliateCallbackState,
  useReferralCreateAffiliateCallback,
} from "../../hooks/referrals/useReferralCreateAffiliateCallback";
import { useCallback, useEffect, useState } from "react";
import { useAddPopup } from "../../state/application/hooks";

type ConfirmAffiliateModalProps = {
  open: boolean;
  handleDismiss?: () => void;
};

const ConfirmAffiliateModal = ({
  open,
  handleDismiss,
}: ConfirmAffiliateModalProps) => {
  const { address: account } = useAccount();
  const { referralAccountData } = useReferralAccountData(account);
  const addPopup = useAddPopup();

  const [signature, setSignature] = useState("");
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [storedError, setStoredError] = useState<string | null>(null);

  const url = `${REFERRAL_API_BASE_URL}/signatures/${account?.toLowerCase()}`;

  const {
    callback: referralCodeCallback,
    state,
    error: hookError,
  } = useReferralCreateAffiliateCallback(signature as `0x${string}`);

  const referralPositionsChecker =
    (referralAccountData?.account?.referralPositions?.length ?? 0) > 0;

  useEffect(() => {
    if (!account) return;
    setFetchingSignature(true);
    fetch(url)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStoredError(data?.message || "Failed to fetch signature");
          return;
        }
        setSignature(data.signature ?? "");
        setStoredError(null);
      })
      .catch((err: any) => {
        console.error("Error fetching signature:", err);
        setStoredError(err?.message || "Failed to fetch signature");
      })
      .finally(() => setFetchingSignature(false));
  }, [url, account]);

  const handleCreateAffiliate = useCallback(async () => {
    if (!referralCodeCallback) {
      setStoredError(
        fetchingSignature
          ? "Signature is still fetching..."
          : "Transaction not ready"
      );
      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message: storedError || "Unknown error",
          type: "error",
        },
      });
      return;
    }

    try {
      await referralCodeCallback();
      setStoredError(null);
    } catch (callbackError: any) {
      console.error("Error creating affiliate:", callbackError);
      const message =
        callbackError?.message ||
        hookError ||
        "Failed to create referral affiliate";
      setStoredError(message);

      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message,
          type: "error",
        },
      });
    }
  }, [
    referralCodeCallback,
    addPopup,
    fetchingSignature,
    hookError,
    storedError,
  ]);

  const isLoading =
    state === ReferralCreateAffiliateCallbackState.LOADING || fetchingSignature;

  return (
    <Modal
      triggerElement={null}
      open={open}
      handleClose={handleDismiss}
      title="Confirm Transaction"
      fontSizeTitle="14px"
      width="310px"
      minHeight="300px"
    >
      <Flex direction="column" width="100%">
        <Text mt="21px" style={{ color: theme.color.grey3, fontSize: "14px" }}>
          Affiliate Program
        </Text>

        <Text
          mt="4px"
          style={{
            color: theme.color.grey2,
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Confirm Transaction to become an Affiliate
        </Text>

        <Flex mt={"21px"} direction={"column"} width={"100%"}>
          <DetailRow
            detail={"Rewards"}
            value={`${
              formatBigNumber(
                referralPositionsChecker
                  ? referralAccountData?.account?.referralPositions[0]
                      .totalRewardsPending
                  : 0,
                18,
                0
              ) ?? 0
            }%`}
          />
          <DetailRow
            detail={"Discount on trading fees"}
            valueColor={theme.color.green1}
            value={`${
              formatBigNumber(
                referralPositionsChecker
                  ? referralAccountData?.account?.referralPositions[0]
                      .totalTraderDiscount
                  : 0,
                18,
                0
              ) ?? 0
            }%`}
          />
          <DetailRow detail={"Cap per user"} value={`??? ${UNIT}`} />
        </Flex>

        <Text my="21px" style={{ color: theme.color.grey3, fontSize: "14px" }}>
          You will need to sign transaction to become an affiliate.
        </Text>

        {isLoading ? (
          <GradientLoaderButton
            title="Processing..."
            height="46px"
            width="100%"
          />
        ) : (
          <GradientSolidButton
            title="Create code"
            width="100%"
            height="46px"
            handleClick={handleCreateAffiliate}
          />
        )}
      </Flex>
    </Modal>
  );
};

export default ConfirmAffiliateModal;
