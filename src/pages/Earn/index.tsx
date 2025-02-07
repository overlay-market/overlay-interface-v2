import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import theme from "../../theme";
import { EarnContainer, EarnContent, LineSeparator } from "./earn-styles";
import Overview from "./Overview";
import Rewards from "./Rewards";
import StakeTable from "./StakeTable";

const Earn: React.FC = () => {
  return (
    <EarnContainer width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align={"center"}
        height={theme.headerSize.height}
        px={"16px"}
      >
        <Text size={"2"} weight={"medium"}>
          Earn
        </Text>
      </Flex>
      <LineSeparator />

      <EarnContent
        direction={"column"}
        gap={{ initial: "24px", sm: "28px", md: "16px" }}
        pt={"16px"}
        pl={{ initial: "4px", sm: "16px" }}
        pr={{ initial: "4px", sm: "0px" }}
      >
        <Overview />
        <Rewards />
        <StakeTable />
      </EarnContent>
    </EarnContainer>
  );
};

export default Earn;
