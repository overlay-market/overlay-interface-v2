import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import Description from "./Description";

const InfoMarketSection: React.FC = () => {
  return (
    <Flex direction="column" gap="16px" px={"8px"}>
      <Text weight={"bold"} size={"5"}>
        About This Market
      </Text>

      <Flex
        width={"100%"}
        direction={{ initial: "column", sm: "row" }}
        align={{ initial: "center", sm: "start" }}
      >
        <Description />
      </Flex>
    </Flex>
  );
};

export default InfoMarketSection;
