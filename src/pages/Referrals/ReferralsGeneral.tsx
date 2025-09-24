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

type ReferralsGeneralProps = {
  setShowSubmitReferralCodeForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReferralsGeneral: React.FC<ReferralsGeneralProps> = ({
  setShowSubmitReferralCodeForm,
}) => {
  const { address: account, chainId } = useAccount();

  const { data: minTradingVolume } = useMinTradingVolume();
  const { referralAccountData, isLoading, refetch, isUninitialized } =
    useReferralAccountData(account);

  const affiliatedTo =
    referralAccountData?.account?.referralPositions[0]?.affiliatedTo?.id;
  const tier = referralAccountData?.account?.referralPositions[0]?.tier;

  const [affiliateLink, setAffiliateLink] = useState("");

  const createCodeValue = useMemo(() => {
    if (!minTradingVolume) {
      return undefined;
    }

    return (
      minTradingVolume -
      Number(
        formatBigNumber(referralAccountData?.account?.ovlVolumeTraded, 18, 0) ??
          0
      )
    );
  }, [minTradingVolume, referralAccountData]);

  const referralPositionsChecker =
    (referralAccountData?.account?.referralPositions?.length ?? 0) > 0;

  const [showConfirmAffiliateModal, setShowConfirmAffiliateModal] =
    useState(false);
  const [reward, setReward] = useState("");
  const [proof, setProof] = useState<Hex[]>([]);

  const rewardsUrl = `${REWARDS_API}/rewards/${account?.toLowerCase()}?campaign=referral`;

  const { callback: claim, state } = useReferralClaim(reward, proof);

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
      setAffiliateLink(
        `${window.location.origin}${location.pathname}?referrer=${account}`
      );
    }
  }, [account]);

  const handleClaim = async () => {
    if (state !== ReferralClaimCallbackState.VALID || !account || !claim)
      return;

    try {
      await claim(account);
      await new Promise((res) => setTimeout(res, 2000)); // wait 2s for indexing
      await refetch();
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
            ? `${createCodeValue.toLocaleString("en-US")} ${UNIT}`
            : "—",
        valueType: "volume left",
        valueTypeLink: false,
        infoTooltip: {
          title: `Trade ${minTradingVolume} ${UNIT} volume to be able to create a referral link.`,
          description:
            "You will need to sign transaction to become an affiliate.",
        },
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
        hasClaimableReward: Number(reward) > 0,
        buttonTooltip:
          (reward &&
            state !== ReferralClaimCallbackState.LOADING &&
            formatAmount(reward)) + " OVL available for claiming",
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
        if (createCodeValue && createCodeValue <= 0) {
          return {
            ...card,
            value: `0 ${UNIT} left`,
            valueType: "Create code ->",
            valueTypeLink: true,
          };
        }
        if (tier && tier > 0) {
          return {
            ...card,
            title: "Referral code",
            value: affiliateLink,
            valueType: "Copy link ->",
            valueTypeLink: true,
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

        {!affiliatedTo && (!tier || tier === 0) && (
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

          {!affiliatedTo && (!tier || tier === 0) && (
            <Flex display={{ initial: "none", sm: "flex" }}>
              <EnterReferralCodeLink
                onClick={() => setShowSubmitReferralCodeForm(true)}
              />
            </Flex>
          )}
        </Flex>

        <Grid columns={{ initial: "1", sm: "2", md: "2", lg: "4" }} gap="4">
          {cardsData.map((card) => (
            <Box key={card.title} p="2">
              <OverviewCard
                title={card.title}
                value={card.value || "0"}
                valueType={card.valueType}
                valueTypeLink={card.valueTypeLink}
                infoTooltip={card.infoTooltip}
                variant="referrals"
                buttonText={card?.buttonText}
                button={card?.button}
                showModal={setShowConfirmAffiliateModal}
                buttonTooltip={card.buttonTooltip}
                hasClaimableReward={card.hasClaimableReward}
              />
            </Box>
          ))}
        </Grid>

        <RebatesTable />

        <ConfirmAffiliateModal
          open={showConfirmAffiliateModal}
          handleDismiss={() => setShowConfirmAffiliateModal(false)}
        />
      </Flex>
    </Flex>
  );
};
