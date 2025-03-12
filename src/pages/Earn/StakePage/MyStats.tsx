import { Flex, Text } from "@radix-ui/themes";
import {
  ClaimRewardsButton,
  MyStatsContainer,
  StatCard,
  StatValue,
} from "./my-stats-styles";
import theme from "../../../theme";
import { useVaultsState } from "../../../state/vaults/hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useCurrentVault,
  useCurrentVaultDetails,
} from "../hooks/useCurrentVaultData";
import { getVaultAddressByVaultName } from "../utils/currentVaultdata";
import { formatReward } from "../utils/formatReward";
import steerClient from "../../../services/steerClient";
import { useAddPopup } from "../../../state/application/hooks";
import { TransactionType } from "../../../constants/transaction";
import { currentTimeParsed } from "../../../utils/currentTime";
import { UNIT } from "../../../constants/applications";
import { handleError } from "../../../utils/handleError";

const MyStats: React.FC = () => {
  const { vaultId } = useParams();
  const { userStats } = useVaultsState();
  const vaultAddress = getVaultAddressByVaultName(vaultId);
  const currentVault = useCurrentVault(vaultAddress);
  const currentVaultDetails = useCurrentVaultDetails(vaultAddress);
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();

  const pendingRewards = useMemo(() => {
    if (!currentVaultDetails?.userRewards) return [];
    if (!currentVault) return [];

    const { userRewards } = currentVaultDetails;

    const rewards = [
      formatReward(userRewards.rewardA, currentVault.rewardTokenADetail),
      currentVault.isDualFactory && currentVault.rewardTokenBDetail
        ? formatReward(userRewards.rewardB, currentVault.rewardTokenBDetail)
        : null,
    ].filter(Boolean);

    return rewards;
  }, [currentVaultDetails, currentVault]);

  const handleClaimRewards = async () => {
    steerClient.staking
      .getReward({
        stakingPool: vaultAddress as `0x${string}`,
      })
      .then((claimTx) => {
        if (claimTx.success && claimTx.data) {
          addPopup(
            {
              txn: {
                hash: claimTx.data as string,
                success: claimTx.success,
                message: "",
                type: TransactionType.CLAIM_REWARDS,
              },
            },
            claimTx.data
          );
        } else {
          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: claimTx.error ?? "Claim rewards failed",
                type: claimTx.status,
              },
            },
            currentTimeForId
          );
        }
      })
      .catch((error: Error) => {
        const { errorCode, errorMessage } = handleError(error);

        addPopup(
          {
            txn: {
              hash: currentTimeForId,
              success: false,
              message: errorMessage,
              type: errorCode,
            },
          },
          currentTimeForId
        );
      });
  };

  return (
    <Flex direction={"column"}>
      <Text style={{ color: theme.color.grey10 }}>MY STATS</Text>

      <MyStatsContainer>
        <StatCard>
          <Text size={"1"}>Current Balance</Text>
          <StatValue>
            {userStats?.currentBalance} {UNIT}
          </StatValue>
        </StatCard>

        <StatCard>
          <Text size={"1"}>Earned Rewards</Text>
          <StatValue>7,500,000 OVL + 7,500,000 BERA</StatValue>
        </StatCard>

        <StatCard>
          <Flex justify={"between"} align={"center"}>
            <Text size={"1"}>Pending Rewards</Text>
            <ClaimRewardsButton onClick={handleClaimRewards}>
              Claim Rewards
            </ClaimRewardsButton>
          </Flex>

          <Flex gap={"10px"}>
            {pendingRewards.map((reward, idx) => (
              <StatValue key={idx}>
                {idx === 1 && `+ `}
                {reward}
              </StatValue>
            ))}
          </Flex>
        </StatCard>
      </MyStatsContainer>
    </Flex>
  );
};

export default MyStats;
