import { Flex, Text } from "@radix-ui/themes";
import useAccount from "../../../hooks/useAccount";
import { UserReferralData } from "../types";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CopyLink,
  Dot,
  DotContainer,
  GradientBorderBox,
  GradientText,
  Toast,
} from "./referral-section-styles";
import { CopyGradientIcon } from "../../../assets/icons/svg-icons";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { REFERRAL_API_BASE_URL } from "../../../constants/applications";
import { useAddPopup } from "../../../state/application/hooks";

export enum UserReferralStatus {
  IsAffiliate = "isAffiliate",
  IsEligibleForAffiliate = "isEligibleForAffiliate",
  IsReferredByAffiliate = "isReferredByAffiliate",
  NotReferredByAffiliate = "notReferredByAffiliate",
}

type ReferralSectionProps = {
  hasJoinedReferralCampaign: boolean | undefined;
  userData: UserReferralData | undefined;
  setOpenReferralModal: Function;
  triggerRefetch: Function;
};

const ReferralSection: React.FC<ReferralSectionProps> = ({
  hasJoinedReferralCampaign,
  userData: fetchedUserData,
  setOpenReferralModal,
  triggerRefetch,
}) => {
  const { address: account } = useAccount();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const addPopup = useAddPopup();
  const lastShownError = useRef<string | null>(null);

  const [userStatus, setUserStatus] = useState(
    UserReferralStatus.NotReferredByAffiliate
  );
  const [toastVisible, setToastVisible] = useState(false);
  const [isActivatingAffiliateStatus, setIsActivatingAffiliateStatus] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userData = useMemo(() => fetchedUserData, [fetchedUserData]);

  const referralCode = useMemo(() => {
    return userData?.myReferralCode;
  }, [userData?.myReferralCode]);

  useEffect(() => {
    if (!account || !userData) {
      setUserStatus(UserReferralStatus.NotReferredByAffiliate);
      return;
    }

    if (referralCode !== null) {
      setUserStatus(UserReferralStatus.IsAffiliate);
      return;
    }

    if (userData.referredByAffiliate !== null) {
      setUserStatus(UserReferralStatus.IsReferredByAffiliate);
      return;
    }

    if (userData.isEligibleForAffiliate) {
      setUserStatus(UserReferralStatus.IsEligibleForAffiliate);
      return;
    }

    setUserStatus(UserReferralStatus.NotReferredByAffiliate);
  }, [account, referralCode, userData]);

  useEffect(() => {
    setIsActivatingAffiliateStatus(false);
  }, [account]);

  useEffect(() => {
    if (!error) return;

    addPopup({ message: error }, Date.now().toString());
    lastShownError.current = error;

    setTimeout(() => {
      if (error === lastShownError.current) {
        setError(null);
        lastShownError.current = null;
      }
    }, 0);
  }, [error]);

  const handleJoinReferralCampaign = () => {
    if (userStatus === UserReferralStatus.NotReferredByAffiliate) {
      setOpenReferralModal(true);
    }
    if (userStatus === UserReferralStatus.IsEligibleForAffiliate) {
      setIsActivatingAffiliateStatus(true);
    }
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
      }?referrer=${referralCode?.toLowerCase()}`
    );
    showToast();
  };

  const handleGenerateReferralCode = async () => {
    setError(null);
    if (!account) return;
    setIsLoading(true);

    try {
      const payload = {
        walletAddress: account,
      };

      const url = new URL(
        "/points-bsc/referral/create-referral-code",
        REFERRAL_API_BASE_URL
      );

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status === 201) {
        triggerRefetch(true);
        return;
      }

      if (response.status !== 201) {
        setError(data.error || "Unexpected error occurred.");
        return;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate referral code."
      );
    } finally {
      setIsLoading(false);
      setIsActivatingAffiliateStatus(false);
    }
  };

  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      {((!hasJoinedReferralCampaign && !isActivatingAffiliateStatus) ||
        userStatus === UserReferralStatus.NotReferredByAffiliate) && (
        <Flex>
          <GradientBorderBox>
            <Flex gap="8px">
              <GradientText
                weight={"medium"}
                style={{ cursor: "pointer" }}
                onClick={handleJoinReferralCampaign}
              >
                Join Referral Campaign
              </GradientText>
            </Flex>
          </GradientBorderBox>
        </Flex>
      )}

      {userStatus === UserReferralStatus.IsAffiliate && referralCode && (
        <Flex direction={{ initial: "column", sm: "row" }} gap={"16px"}>
          <GradientBorderBox>
            <Flex gap="8px">
              <Text>Your referral code is active </Text>
              <GradientText weight={"medium"}>
                {referralCode.toUpperCase()}
              </GradientText>
            </Flex>
          </GradientBorderBox>
          <GradientBorderBox>
            <Flex gap={"8px"}>
              <Text weight={"medium"}>Copy referral link</Text>
              <CopyLink onClick={handleCopyLink}>
                <CopyGradientIcon />
              </CopyLink>
              <Toast visible={toastVisible.toString()}>
                Link copied to clipboard
              </Toast>
            </Flex>
          </GradientBorderBox>
        </Flex>
      )}

      {userStatus === UserReferralStatus.IsReferredByAffiliate && (
        <Flex direction={{ initial: "column", sm: "row" }} gap={"16px"}>
          <GradientBorderBox>
            <Text weight={"medium"}>
              Joined with{" "}
              <GradientText weight={"medium"}>
                {userData?.referredByAffiliate?.referralCodeUsed.toUpperCase()}
              </GradientText>
            </Text>
          </GradientBorderBox>

          {userData?.isEligibleForAffiliate && !referralCode && (
            <GradientBorderBox>
              {!isLoading ? (
                <GradientText weight={"medium"} style={{ cursor: "pointer" }}>
                  Create your own code
                </GradientText>
              ) : (
                <Flex gap={"8px"}>
                  <GradientText weight={"medium"} style={{ cursor: "pointer" }}>
                    Processing
                  </GradientText>
                  <DotContainer>
                    <Dot delay="0s" />
                    <Dot delay="0.15s" />
                    <Dot delay="0.25s" />
                  </DotContainer>
                </Flex>
              )}
            </GradientBorderBox>
          )}
        </Flex>
      )}

      {userStatus === UserReferralStatus.IsEligibleForAffiliate &&
        isActivatingAffiliateStatus &&
        (isLoading ? (
          <GradientLoaderButton
            title={"Generating..."}
            width={isMobile ? "100%" : "240px"}
            height={"49px"}
          />
        ) : (
          <GradientSolidButton
            title={"Generate referral code"}
            width={isMobile ? "100%" : "240px"}
            height={"49px"}
            handleClick={handleGenerateReferralCode}
          />
        ))}
    </Flex>
  );
};

export default ReferralSection;
