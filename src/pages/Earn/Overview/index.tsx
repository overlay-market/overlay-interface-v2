import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { GreenDot, InfoItem } from "./overview-styles";

const Overview: React.FC = () => {
  return (
    <Flex
      justify={"between"}
      align={"center"}
      width={{ initial: "100%", lg: "411px" }}
      p={"14px"}
      style={{ background: theme.color.grey4, borderRadius: "8px" }}
    >
      <InfoItem>
        <Text>TVL</Text>
        <Text weight={"bold"}>$120,500,000</Text>
      </InfoItem>

      <GreenDot />

      <InfoItem>
        <Text>Max APY</Text>
        <Text weight={"bold"}>8,75%</Text>
      </InfoItem>

      {/* <GreenDot />

      <InfoItem>
        <Text>Total Stakers</Text>
        <Text weight={"bold"}>18,750</Text>
      </InfoItem>

      <GreenDot />

      <InfoItem>
        <Text>Total Rewards Distributed</Text>
        <Text weight={"bold"}>4,320,000 OVL</Text>
      </InfoItem> */}
    </Flex>
  );
};

export default Overview;
