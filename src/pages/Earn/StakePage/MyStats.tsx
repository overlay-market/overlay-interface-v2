import { Flex, Text } from "@radix-ui/themes";
import {
  ClaimRewardsButton,
  MyStatsContainer,
  StatCard,
  StatValue,
} from "./my-stats-styles";
import theme from "../../../theme";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useCurrentVault } from "../hooks/useCurrentVaultData";
import { useUserRewards } from "../hooks/useUserRewards";
import { useUserCurrentBalance } from "../hooks/useUserCurrentBalance";

const MyStats: React.FC = () => {
  const { vaultId } = useParams();
  const currentVault = useCurrentVault(vaultId);

  if (!currentVault) {
    return null;
  }

  const { rewards: userRewards } = useUserRewards(currentVault?.id);
  const { curBalance, loading } = useUserCurrentBalance(currentVault?.id);

  const userTokensBalance = curBalance.map((tokenBalance) => {
    return {
      tokenSymbol: tokenBalance.tokenSymbol,
      amount: Number(tokenBalance.amount).toLocaleString(undefined, {
        maximumSignificantDigits: 4,
      }),
      tokenValue: tokenBalance.tokenValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  });

  const totalTokensValue = useMemo(() => {
    if (loading) return "";
    const total = curBalance.reduce((acc, tokenData) => {
      return acc + Number(tokenData.tokenValue);
    }, 0);
    return `$${total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [curBalance, loading]);

  const handleClaimRewards = async () => {};

  return (
    <Flex direction={"column"}>
      <Text style={{ color: theme.color.grey10 }}>MY STATS</Text>

      <MyStatsContainer>
        <StatCard>
          <Flex justify={"between"} align={"center"}>
            <Text size={"1"}>Current Balance</Text>
            <Text size={"4"} weight={"bold"}>
              {totalTokensValue}
            </Text>
          </Flex>
          {userTokensBalance.map((tokenData) => (
            <Flex
              justify={"between"}
              align={"center"}
              key={tokenData.tokenSymbol + tokenData.amount}
            >
              <StatValue>{tokenData.tokenSymbol}</StatValue>
              <StatValue>
                {tokenData.amount}{" "}
                <span
                  style={{ color: theme.color.grey3, fontWeight: "normal" }}
                >
                  /
                </span>{" "}
                ${tokenData.tokenValue}
              </StatValue>
            </Flex>
          ))}
        </StatCard>

        <StatCard>
          <Flex justify={"between"} align={"center"}>
            {userRewards.length === 0 ? (
              <Text size={"1"}>No Pending Rewards</Text>
            ) : (
              <Text size={"1"}>Pending Rewards</Text>
            )}
            {userRewards.length > 0 && (
              <ClaimRewardsButton onClick={handleClaimRewards}>
                Claim Rewards
              </ClaimRewardsButton>
            )}
          </Flex>

          <Flex gap={"10px"}>
            <StatValue>{userRewards.join(" + ")}</StatValue>
          </Flex>
        </StatCard>
      </MyStatsContainer>
    </Flex>
  );
};

export default MyStats;
