import { useEffect, useMemo, useState } from "react";
import useAccount from "../../hooks/useAccount";
import { useReferralAccountData } from "../../hooks/referrals/useReferralAccountData";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./referrals-styles";
import ReferralModal from "./ReferralModal";
import { UNIT } from "../../constants/applications";
import OverviewCard from "../../components/OverviewCard";
import { formatBigNumber } from "../../utils/formatBigNumber";
import { EnterReferralCodeLink } from "./EnterReferralCodeLink";
import { useMinTradingVolume } from "../../hooks/referrals/useMinTradingVolume";

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

  // const [showModalTrigger, setShowModalTrigger] = useState(false);
  // const [reward, setReward] = useState("");
  // const [proof, setProof] = useState<string[]>([]);

  // const rewardsUrl = `${REWARDS_API}/rewards/${account?.toLowerCase()}?campaign=referral`;

  // const { callback: referralClaimCallback } = useReferralClaimCallback(
  //   reward,
  //   proof
  // );

  // useEffect(() => {
  //   fetch(rewardsUrl)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setReward((data.reward ?? [""]).toString());
  //       setProof(data.proof ?? [""]);
  //     })
  //     .catch((err) => console.error("Error fetching rewards:", err));
  // }, [rewardsUrl]);

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

  const cardsData = useMemo(
    () => [
      {
        title: "Create a referral code",
        value:
          createCodeValue !== undefined
            ? `${createCodeValue.toLocaleString("en-US")} ${UNIT}`
            : "—",
        valueType: "volume left",
        valueTypeLink: false,
      },
      {
        title: "Rewards pending",
        value:
          (referralPositionsChecker &&
            formatBigNumber(
              referralAccountData?.account?.referralPositions[0]
                ?.totalRewardsPending
            )) ??
          "0",
        valueType: UNIT,
        // buttonText: "Claim ->",
        // button: referralClaimCallback,
        // hasClaimableReward: Number(reward) > 0,
        // tooltip:
        //   (reward && formatBigNumber(reward)) + " OVL available for claiming.",
      },
      {
        title: "Total Rewards earned",
        value: referralPositionsChecker
          ? formatBigNumber(
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
    ],
    [
      createCodeValue,
      referralPositionsChecker,
      referralAccountData,
      // referralClaimCallback,
      // reward,
    ]
  );

  // Post-process card logic
  cardsData.forEach((card) => {
    if (card.title === "Create a referral code") {
      if (createCodeValue === 0) {
        card.value += " volume left";
        card.valueType = "Create code →";
        card.valueTypeLink = true;
      }
      if (tier && tier > 0) {
        card.valueTypeLink = true;
        card.value = affiliateLink;
        card.valueType = "Copy link →";
      }
    }
  });

  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
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
                // buttonText={card?.buttonText}
                // button={card?.button}
                // showModal={setShowModalTrigger}
                // tooltip={card.tooltip}
                // hasClaimableReward={card.hasClaimableReward}
              />
            </Box>
          ))}
        </Grid>

        {/* <RebatesTable /> */}

        {/* <ConfirmAffiliateModal
            isOpen={showModalTrigger}
            onDismiss={() => setShowModalTrigger(false)}
          /> */}
      </Flex>
    </Flex>
  );
};
