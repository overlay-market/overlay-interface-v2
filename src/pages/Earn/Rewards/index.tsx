import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { RewardCard, TitleText } from "./rewards-styles";
import Utopia from "../../../assets/images/stake-images/utopia.png";

const Rewards: React.FC = () => {
  return (
    <Flex direction={"column"}>
      <Text style={{ color: theme.color.grey10 }}>REWARDS</Text>

      <Flex direction={"column"} gap={"16px"}>
        <RewardCard src={Utopia} bgposition={"0% 40%"} height={"76px"}>
          <Flex direction={"column"} gap={"8px"} width={"540px"}>
            <Flex gap={"8px"} align={"center"}>
              <TitleText>COMING SOON</TitleText>
            </Flex>

            <Text size={"1"} style={{ color: "#F2F2F2", lineHeight: "14px" }}>
              Check back soon for new rewards and challenges
            </Text>
          </Flex>
        </RewardCard>

        {/* <RewardCard src={CS2Skins} bgposition={"0% 37%"}>
          <Flex direction={"column"} gap={"8px"} width={"542px"}>
            <Flex gap={"8px"} align={"center"}>
              <TitleText>
                Trade{" "}
                <span style={{ color: theme.color.blue3 }}>
                  Counter-Strike 2 Rifle Skin Index
                </span>
              </TitleText>

              <ApyBadge>
                <ApyBagdeText>Fixed APY</ApyBagdeText>
              </ApyBadge>
            </Flex>

            <Text size={"1"} style={{ color: "#F2F2F2", lineHeight: "14px" }}>
              Earn daily rewards based on volume on this market. This reward is
              distributed automatically to your staked balance.
            </Text>
          </Flex>

          <Flex>Next Payout</Flex>
        </RewardCard> */}

        {/* <RewardCard src={QuantumCats} bgposition={"0% 32%"}>
          <Flex direction={"column"} gap={"8px"} width={"540px"}>
            <Flex gap={"8px"} align={"center"}>
              <TitleText>Staking Reward – Daily Yield</TitleText>

              <ApyBadge>
                <ApyBagdeText>Fixed APY</ApyBagdeText>
              </ApyBadge>
            </Flex>

            <Text size={"1"} style={{ color: "#F2F2F2", lineHeight: "14px" }}>
              Earn daily rewards based on your staked amount. This reward is
              distributed automatically to your staking balance, ensuring
              passive income.
            </Text>
          </Flex>

          <Flex>Next Payout</Flex>
        </RewardCard> */}
      </Flex>
    </Flex>
  );
};

export default Rewards;
