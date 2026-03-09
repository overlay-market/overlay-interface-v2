import { useCallback, useEffect, useMemo, useState } from "react";
import useAccount from "../../hooks/useAccount";
import { useReferralAccountData } from "../../hooks/referrals/useReferralAccountData";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./referrals-styles";
import ReferralModal from "./ReferralModal";
import { REWARDS_API, UNIT } from "../../constants/applications";
import OverviewCard from "../../components/OverviewCard";
import { formatBigNumber } from "../../utils/formatBigNumber";
import { EnterReferralCodeLink } from "./EnterReferralCodeLink";
import { useMinTradingVolume } from "../../hooks/referrals/useMinTradingVolume";
import ConfirmAffiliateModal from "./ConfirmAffiliateModal";
import { RebatesTable } from "./RebatesTable";
import {
  ReferralClaimCallbackState,
  useReferralClaim,
} from "../../hooks/referrals/useReferralClaim";
import { Hex } from "viem";
import { formatAmount } from "../../utils/formatAmount";
import { useAlreadyClaimed } from "../../hooks/referrals/useAlreadyClaimed";
import { useOvlPrice } from "../../hooks/useOvlPrice";
import { useAffiliateAlias } from "../../hooks/referrals/useAffiliateAlias";

type ReferralsGeneralProps = {
  setShowSubmitReferralCodeForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReferralsGeneral: React.FC<ReferralsGeneralProps> = ({
  setShowSubmitReferralCodeForm,
}) => {
  const { address: account, chainId, isAvatarTradingActive } = useAccount();
  const isEligible = !!account && !isAvatarTradingActive;

  const { data: minTradingVolume } = useMinTradingVolume();
  const { data: ovlPrice } = useOvlPrice();
  const { referralAccountData, isLoading, refetch, isUninitialized } =
    useReferralAccountData(account);
  const { data: affiliateAliasData } = useAffiliateAlias(account);

  const affiliatedTo =
    referralAccountData?.account?.referralPositions[0]?.affiliatedTo?.id;
  const tier = referralAccountData?.account?.referralPositions[0]?.tier;

  const [affiliateLink, setAffiliateLink] = useState("");

  const ovlVolumeLeft = useMemo(() => {
    if (!minTradingVolume) return undefined;

    return Math.max(
      0,
      minTradingVolume -
        Number(
          formatBigNumber(referralAccountData?.account?.ovlVolumeTraded, 18, 0) ?? 0
        )
    );
  }, [minTradingVolume, referralAccountData]);

  const createCodeValue = useMemo(() => {
    if (ovlVolumeLeft === undefined || !ovlPrice) return undefined;

    return Math.round(ovlVolumeLeft * ovlPrice);
  }, [ovlVolumeLeft, ovlPrice]);

  const referralPositionsChecker =
    (referralAccountData?.account?.referralPositions?.length ?? 0) > 0;

  const [showConfirmAffiliateModal, setShowConfirmAffiliateModal] =
    useState(false);
  const [reward, setReward] = useState("");
  const [proof, setProof] = useState<Hex[]>([]);

  const rewardsUrl = `${REWARDS_API}/rewards/${account?.toLowerCase()}?campaign=referral`;

  const { callback: claim, state } = useReferralClaim(reward, proof);
  const alreadyClaimed = useAlreadyClaimed(reward, proof);

  const fetchRewards = useCallback(() => {
    if (!account) return;
    return fetch(rewardsUrl)
      .then((res) => res.json())
      .then((data) => {
        setReward((data.reward ?? "").toString());
        setProof(data.proof ?? []);
      })
      .catch((err) => console.error("Error fetching rewards:", err));
  }, [account, rewardsUrl]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  useEffect(() => {
    if (!isUninitialized) refetch();
  }, [chainId, isLoading, refetch, account, isUninitialized]);

  useEffect(() => {
    if (account) {
      const referrerParam = affiliateAliasData?.alias ?? account;
      setAffiliateLink(
        `${window.location.origin}${location.pathname}?referrer=${referrerParam}`
      );
    }
  }, [account, affiliateAliasData]);

  const handleClaim = async () => {
    if (state !== ReferralClaimCallbackState.VALID || !account || !claim)
      return;

    const initialEarnedRewards = Number(
      referralAccountData?.account?.referralPositions?.[0]
        ?.totalAirdroppedAmount ?? 0
    );

    try {
      await claim(account);

      // Poll for updated rewards
      const maxRetries = 10;
      const delayMs = 2000;
      let retries = 0;
      let updated = false;

      while (retries < maxRetries && !updated) {
        await new Promise((res) => setTimeout(res, delayMs));
        const { data } = await refetch();

        const earnedRewardsAfter = Number(
          data?.account?.referralPositions?.[0]?.totalAirdroppedAmount ?? 0
        );

        if (initialEarnedRewards < earnedRewardsAfter) {
          updated = true;
        }

        retries++;
      }

      await fetchRewards();
    } catch (err) {
      console.error("Claim failed", err);
    }
  };

  const cardsData = useMemo(() => {
    const baseCards = [
      {
        title: "Create a referral code",
        value:
          createCodeValue !== undefined
            ? `~$${createCodeValue.toLocaleString("en-US")}`
            : "—",
        valueType: "volume left",
        valueTooltip:
          ovlVolumeLeft !== undefined
            ? `${ovlVolumeLeft.toLocaleString("en-US")} OVL`
            : undefined,
        valueTypeLink: false,
        infoTooltip: {
          title: `Trade ~$${minTradingVolume && ovlPrice ? Math.round(minTradingVolume * ovlPrice).toLocaleString("en-US") : "..."} volume to be able to create a referral link.`,
          description:
            "You will need to sign transaction to become an affiliate.",
        },
        copyValue: undefined as string | undefined,
        secondaryAction: undefined as string | undefined,
      },
      {
        title: "Rewards pending",
        value:
          (referralPositionsChecker &&
            formatAmount(
              referralAccountData?.account?.referralPositions[0]
                ?.totalRewardsPending
            )) ??
          "0",
        valueType: UNIT,
        buttonText:
          state === ReferralClaimCallbackState.LOADING
            ? "Processing..."
            : "Claim ->",
        button: handleClaim,
        hasClaimableReward: alreadyClaimed === false && Number(reward) > 0,
        buttonTooltip: `${
          alreadyClaimed === false &&
          state !== ReferralClaimCallbackState.LOADING &&
          reward
            ? formatAmount(reward)
            : "0"
        } OVL available for claiming`,
      },
      {
        title: "Total Rewards earned",
        value: referralPositionsChecker
          ? formatAmount(
              referralAccountData?.account?.referralPositions[0]
                ?.totalAirdroppedAmount
            ) ?? "0"
          : "0",
        valueType: UNIT,
      },
      {
        title: "Total Referrals",
        value:
          referralPositionsChecker &&
          (referralAccountData?.account?.referralPositions[0]?.accountsReferred?.toString() ??
            "0"),
        valueType: "Users",
      },
    ];

    return baseCards.map((card) => {
      if (card.title === "Create a referral code") {
        if (tier && tier > 0) {
          const alias = affiliateAliasData?.alias;
          const displayValue = alias?.toUpperCase() || account;
          return {
            ...card,
            title: "Referral code",
            value: displayValue,
            copyValue: affiliateLink,
            valueType: "Copy link ->",
            valueTypeLink: true,
            secondaryAction: !alias ? "Set alias ->" : undefined,
            valueTooltip: undefined,
            infoTooltip: undefined,
          };
        }
        if (createCodeValue !== undefined && createCodeValue <= 0) {
          return {
            ...card,
            value: "Eligible",
            valueType: "Create code ->",
            valueTypeLink: true,
            valueTooltip: undefined,
            infoTooltip: undefined,
          };
        }
      }
      return card;
    });
  }, [
    createCodeValue,
    minTradingVolume,
    referralPositionsChecker,
    referralAccountData,
    reward,
    state,
    tier,
    affiliateLink,
    affiliateAliasData,
    handleClaim,
  ]);

  return (
    <Flex width={"100%"} height={"auto"} direction={"column"} mb={"90px"}>
      <Flex
        justify={{ initial: "between", sm: "start" }}
        align={"center"}
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

        {isEligible && !affiliatedTo && (!tier || tier === 0) && (
          <Flex display={{ initial: "flex", sm: "none" }}>
            <EnterReferralCodeLink
              onClick={() => setShowSubmitReferralCodeForm(true)}
            />
          </Flex>
        )}
      </Flex>
      <LineSeparator />

      <Flex
        direction="column"
        width={"100%"}
        px={{ initial: "0px", sm: "8px" }}
      >
        <Flex pt={"36px"} px={"8px"} justify={"between"}>
          <ReferralModal tier="ambassador" />

          {isEligible && !affiliatedTo && (!tier || tier === 0) && (
            <Flex display={{ initial: "none", sm: "flex" }}>
              <EnterReferralCodeLink
                onClick={() => setShowSubmitReferralCodeForm(true)}
              />
            </Flex>
          )}
        </Flex>

        {!account && (
          <Text style={{ padding: "20px 8px" }}>Nothing here yet. Connect the wallet.</Text>
        )}

        {account && isAvatarTradingActive && (
          <Text style={{ padding: "20px 8px", color: theme.color.grey3 }}>
            Funded accounts are not eligible for the referral program. Please switch to your personal wallet.
          </Text>
        )}

        <Grid columns={{ initial: "1", sm: "2", md: "2", lg: "4" }} gap="4">
          {cardsData.map((card) => (
            <Box key={card.title} p="2">
              <OverviewCard
                title={card.title}
                value={isEligible ? (card.value || "0") : "—"}
                valueType={isEligible ? card.valueType : null}
                valueTooltip={isEligible ? card.valueTooltip : undefined}
                valueTypeLink={card.valueTypeLink}
                infoTooltip={isEligible ? card.infoTooltip : undefined}
                variant="referrals"
                buttonText={isEligible ? card?.buttonText : undefined}
                button={isEligible ? card?.button : undefined}
                showModal={setShowConfirmAffiliateModal}
                buttonTooltip={isEligible ? card.buttonTooltip : undefined}
                hasClaimableReward={isEligible ? card.hasClaimableReward : false}
                copyValue={isEligible ? card.copyValue : undefined}
                secondaryAction={isEligible ? card.secondaryAction : undefined}
              />
            </Box>
          ))}
        </Grid>

        {isEligible && (
          <>
            <RebatesTable />

            <ConfirmAffiliateModal
              open={showConfirmAffiliateModal}
              handleDismiss={() => setShowConfirmAffiliateModal(false)}
              isAlreadyAffiliate={!!tier && tier > 0}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
};
