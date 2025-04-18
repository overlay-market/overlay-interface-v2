import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { GreenDot, InfoItem } from "./overview-styles";
import { useVaultsState } from "../../../state/vaults/hooks";
import { useMemo } from "react";

const Overview: React.FC = () => {
  const { vaultsDetails } = useVaultsState();

  const tvl = useMemo(() => {
    if (!vaultsDetails || vaultsDetails.length === 0) return "";

    const sum = vaultsDetails.reduce(
      (sum, vault) => sum + Number(vault.tvl),
      0
    );
    const formattedTVL = `$${sum.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
    return formattedTVL;
  }, [vaultsDetails]);

  const maxAPR = useMemo(() => {
    if (!vaultsDetails || vaultsDetails.length === 0) return "0";

    const max = Math.max(
      ...vaultsDetails.map((vault) => Number(vault.totalApr))
    );
    const formattedMax = `${max.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}%`;
    return formattedMax;
  }, [vaultsDetails]);

  const totalStakers = useMemo(() => {
    if (!vaultsDetails || vaultsDetails.length === 0) return "0";

    const total = vaultsDetails.reduce(
      (sum, vault) => sum + vault.stakersCount,
      0
    );
    const formattedTotal = `${total.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
    return formattedTotal;
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
        <Text weight={"bold"}>{tvl}</Text>
      </InfoItem>

      <GreenDot />

      <InfoItem>
        <Text>Max APR</Text>
        <Text weight={"bold"}>{maxAPR}</Text>
      </InfoItem>

      <GreenDot />

      <InfoItem>
        <Text>Total Stakers</Text>
        <Text weight={"bold"}>{totalStakers}</Text>
      </InfoItem>

      {/* <GreenDot />

      <InfoItem>
        <Text>Total Rewards Distributed</Text>
        <Text weight={"bold"}>4,320,000 OVL</Text>
      </InfoItem> */}
    </Flex>
  );
};

export default Overview;
