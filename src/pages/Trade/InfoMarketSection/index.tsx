import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import Description from "./Description";
import GrafanaPanel from "./GrafanaPanel";

const InfoMarketSection: React.FC = () => {
  return (
    <Flex
      direction="column"
      gap="16px"
      p={{ initial: "20px 4px 66px", sm: "20px 8px 66px" }}
    >
      <Text weight={"bold"} size={"5"}>
        About This Market
      </Text>

      <Flex
        width={"100%"}
        direction={{ initial: "column", md: "row" }}
        align={"start"}
        gap="16px"
      >
        <Description />
        <GrafanaPanel />
      </Flex>
    </Flex>
  );
};

export default InfoMarketSection;
