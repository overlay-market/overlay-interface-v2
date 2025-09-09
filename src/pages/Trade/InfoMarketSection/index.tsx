import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import Description from "./Description";
import GrafanaPanel from "./GrafanaPanel";
import Analytics from "./Analytics";
import { InfoMarketContainer } from "./info-market-section-styles";
import RiskParameters from "./RiskParameters";
import TabsMobile from "./TabsMobile";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const InfoMarketSection: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

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
        <InfoMarketContainer>
          <Description />
          <Analytics />
        </InfoMarketContainer>

        {!isMobile && <GrafanaPanel />}
      </Flex>
      {!isMobile && <RiskParameters />}

      {isMobile && <TabsMobile />}
    </Flex>
  );
};

export default InfoMarketSection;
