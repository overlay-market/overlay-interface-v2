import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { GreenDot, InfoItem } from "./overview-styles";
import { useVaultsState } from "../../../state/vaults/hooks";
import { useMemo } from "react";

const Overview: React.FC = () => {
  const { vaultsDetails } = useVaultsState();

  const tvl = useMemo(() => {
    if (!vaultsDetails) return "0";

    const sum = vaultsDetails.reduce(
      (sum, vault) => sum + vault.totalSupply,
      0
    );
    const formattedTVL = sum.toLocaleString();
    return formattedTVL;
  }, [vaultsDetails]);

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
        <Text weight={"bold"}>{tvl} OVL</Text>
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
