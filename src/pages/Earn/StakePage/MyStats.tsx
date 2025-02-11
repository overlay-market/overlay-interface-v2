import { Flex, Text } from "@radix-ui/themes";
import {
  ClaimRewardsButton,
  MyStatsContainer,
  StatCard,
  StatValue,
} from "./my-stats-styles";
import theme from "../../../theme";

const MyStats: React.FC = () => {
  return (
    <Flex direction={"column"}>
      <Text style={{ color: theme.color.grey10 }}>MY STATS</Text>

      <MyStatsContainer>
        <StatCard>
          <Text size={"1"}>Current Balance</Text>
          <StatValue>500 OVL</StatValue>
        </StatCard>

        <StatCard>
          <Text size={"1"}>Earned Rewards</Text>
          <StatValue>7,500,000 OVL + 7,500,000 BERA</StatValue>
        </StatCard>

        <StatCard>
          <Flex justify={"between"} align={"center"}>
            <Text size={"1"}>Pending Rewards</Text>
            <ClaimRewardsButton
              onClick={() => {
                console.log("claim");
              }}
            >
              Claim Rewards
            </ClaimRewardsButton>
          </Flex>

          <StatValue>7,500,000 OVL + 7,500,000 BERA</StatValue>
        </StatCard>
      </MyStatsContainer>
    </Flex>
  );
};

export default MyStats;
