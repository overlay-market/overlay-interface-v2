import { Flex, Skeleton, Text } from "@radix-ui/themes";
import useAccount from "../../../hooks/useAccount";
import { UserReferralData } from "../types";
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
import { useAddPopup } from "../../../state/application/hooks";
import { generateReferralCode } from "../utils/generateReferralCode";
import ReferralBanner from "../../../assets/images/torch-referral-program-banner.webp";
import ReferralBannerMobile from "../../../assets/images/torch-referral-banner-mobile.webp";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

export enum UserReferralStatus {
  IsAffiliate = "isAffiliate",
  IsEligibleForAffiliate = "isEligibleForAffiliate",
  IsReferredByAffiliate = "isReferredByAffiliate",
  NotReferredByAffiliate = "notReferredByAffiliate",
  IsUndefined = "isUndefined",
}

type ReferralSectionProps = {
  hasJoinedReferralCampaign: boolean;
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

  const addPopup = useAddPopup();
  const lastShownError = useRef<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [userStatus, setUserStatus] = useState(UserReferralStatus.IsUndefined);
  const [toastVisible, setToastVisible] = useState(false);
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

    if (referralCode) {
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
    setOpenReferralModal(true);
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
      const result = await generateReferralCode(account);
      if (result.success) {
        triggerRefetch(true);
      } else {
        setError(result.error ?? null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate referral code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex width={"100%"} height={"auto"} direction={"column"}>
      {userStatus === UserReferralStatus.IsUndefined && (
        <Skeleton
          width={{ initial: "100%", sm: "360px" }}
          height="50px"
          style={{ borderRadius: "32px" }}
        />
      )}

      {(!hasJoinedReferralCampaign ||
        userStatus === UserReferralStatus.NotReferredByAffiliate) && (
        <Flex
          onClick={handleJoinReferralCampaign}
          ml={{ initial: "0px", sm: "-17px", md: "-13px" }}
          style={{
            cursor: "pointer",
          }}
        >
          <img
            src={isMobile ? ReferralBannerMobile : ReferralBanner}
            style={{ width: "100%", height: "auto" }}
            alt="Torch Referral Program Banner"
          />
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
                <GradientText
                  weight={"medium"}
                  style={{ cursor: "pointer" }}
                  onClick={handleGenerateReferralCode}
                >
                  Create your own code
                </GradientText>
              ) : (
                <Flex gap={"8px"}>
                  <GradientText weight={"medium"} style={{ cursor: "pointer" }}>
                    Generating
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
    </Flex>
  );
};

export default ReferralSection;
