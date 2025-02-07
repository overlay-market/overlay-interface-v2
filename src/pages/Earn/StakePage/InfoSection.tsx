import { Flex } from "@radix-ui/themes";
import React from "react";
import { InfoBox, TextLabel, TextValue } from "./info-section-styles";
import theme from "../../../theme";
import TopSection from "./TopSection";

const InfoSection: React.FC = () => {
  return (
    <Flex direction={"column"} gap={"16px"}>
      <TopSection />

      <InfoBox>
        <TextLabel>TVL</TextLabel>
        <TextValue>$250M</TextValue>
      </InfoBox>
      <InfoBox>
        <TextLabel>APY</TextLabel>
        <TextValue style={{ color: theme.color.green2 }}>5.2%</TextValue>
      </InfoBox>
    </Flex>
  );
};

export default InfoSection;
