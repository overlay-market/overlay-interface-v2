import useAccount from "../../hooks/useAccount";
import { REFERRAL_API_BASE_URL, UNIT } from "../../constants/applications";
import { Flex, Text } from "@radix-ui/themes";
import Modal from "../../components/Modal";
import theme from "../../theme";
import DetailRow from "../../components/Modal/DetailRow";
import { useReferralTierRates } from "../../hooks/referrals/useReferralTierRates";
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
import AliasSubmit from "./SubmitReferralCode/AliasSubmit";

type ConfirmAffiliateModalProps = {
  open: boolean;
  handleDismiss?: () => void;
  isAlreadyAffiliate?: boolean;
};

const ConfirmAffiliateModal = ({
  open,
  handleDismiss,
  isAlreadyAffiliate,
}: ConfirmAffiliateModalProps) => {
  const { address: account } = useAccount();
  const { data: tierRates } = useReferralTierRates(1); // AFFILIATE tier
  const addPopup = useAddPopup();

  const [signature, setSignature] = useState("");
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [, setStoredError] = useState<string | null>(null);
  const [showAliasRegistration, setShowAliasRegistration] = useState(false);
  const [aliasRegistered, setAliasRegistered] = useState(false);

  const showAlias = showAliasRegistration || isAlreadyAffiliate;

  const url = `${REFERRAL_API_BASE_URL}/signatures/${account?.toLowerCase()}`;

  const {
    callback: referralCodeCallback,
    state,
    error: hookError,
  } = useReferralCreateAffiliateCallback(signature as `0x${string}`);

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
      const message = fetchingSignature
        ? "Signature is still fetching..."
        : "Transaction not ready";
      setStoredError(message);
      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message,
          type: "error",
        },
      });
      return;
    }

    setSubmitting(true);
    try {
      await referralCodeCallback();
      setStoredError(null);
      setShowAliasRegistration(true);
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
    } finally {
      setSubmitting(false);
    }
  }, [
    referralCodeCallback,
    addPopup,
    fetchingSignature,
    hookError,
  ]);

  const handleClose = () => {
    setShowAliasRegistration(false);
    setAliasRegistered(false);
    handleDismiss?.();
  };

  const isLoading =
    state === ReferralCreateAffiliateCallbackState.LOADING || fetchingSignature || submitting;

  return (
    <Modal
      triggerElement={null}
      open={open}
      handleClose={handleClose}
      title={showAlias ? "Register Alias" : "Confirm Transaction"}
      fontSizeTitle="14px"
      width={showAlias ? "370px" : "310px"}
      minHeight={showAlias ? undefined : "300px"}
    >
      {showAlias ? (
        <Flex direction="column" width="100%" gap="16px" mt="12px">
          <AliasSubmit alias={null} inline onSuccess={() => setAliasRegistered(true)} />
          {!aliasRegistered && (
            <Text
              onClick={handleClose}
              style={{
                color: theme.color.grey3,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Skip for now
            </Text>
          )}
        </Flex>
      ) : (
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
              detail={"Affiliate commission"}
              value={tierRates ? `${tierRates.affiliateCommission}%` : "—"}
            />
            <DetailRow
              detail={"Trader discount"}
              valueColor={theme.color.green1}
              value={tierRates ? `${tierRates.traderDiscount}%` : "—"}
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
      )}
    </Modal>
  );
};

export default ConfirmAffiliateModal;
