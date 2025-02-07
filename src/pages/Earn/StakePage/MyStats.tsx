import { Flex, Text } from "@radix-ui/themes";
import { InfoCard } from "./my-stats-styles";
import theme from "../../../theme";

const MyStats: React.FC = () => {
  return (
    <Flex direction={"column"}>
      <Text style={{ color: theme.color.grey10 }}>MY STATS</Text>

      <Flex
        justify={"between"}
        gap={"12px"}
        p={"12px"}
        style={{ background: theme.color.grey4, borderRadius: "8px" }}
      >
        <InfoCard>
          <Text size={"1"}>Current Balance</Text>
          <Flex align={"center"} height={"14px"}>
            <Text weight={"bold"} size={"3"}>
              500 OVL
            </Text>
          </Flex>
        </InfoCard>

        <InfoCard>
          <Text size={"1"}>Earned Rewards</Text>
          <Flex align={"center"} height={"14px"}>
            <Text weight={"bold"} size={"3"}>
              7,500,000 OVL + 7,500,000 BERA
            </Text>
          </Flex>
        </InfoCard>

        <InfoCard>
          <Flex justify={"between"} align={"center"}>
            <Text size={"1"}>Pending Rewards</Text>
            <Text
              size={"1"}
              style={{
                color: theme.color.blue3,
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                console.log("claim");
              }}
            >
              Claim Rewards
            </Text>
          </Flex>
          <Flex align={"center"} height={"14px"}>
            <Text weight={"bold"} size={"3"}>
              7,500,000 OVL + 7,500,000 BERA
            </Text>
          </Flex>
        </InfoCard>
      </Flex>
    </Flex>
  );
};

export default MyStats;
