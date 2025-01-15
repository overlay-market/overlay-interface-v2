import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import theme from "../../../theme";
import { InfoCircleIcon } from "../../../assets/icons/svg-icons";

const TitleSection: React.FC = () => {
  return (
    <Flex direction={"column"} pt="16px" gap="8px">
      <Text size={{ initial: "5", md: "6" }} style={{ fontWeight: "600" }}>
        Eligibility Checker 🪂
      </Text>
      <Flex gap="8px" style={{ color: theme.color.grey10 }}>
        <Text size={"1"}>Check eligibility for Airdrop 1</Text>
        <InfoCircleIcon />
      </Flex>
    </Flex>
  );
};

export default TitleSection;
