import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import {
  InfoBox,
  RewardBox,
  TextLabel,
  TextValue,
} from "./info-section-styles";
import theme from "../../../theme";
import TopSection from "./TopSection";
import { useParams } from "react-router-dom";
import { VAULTS_TOKEN_LOGOS } from "../../../constants/stake";

const InfoSection: React.FC = () => {
  const { vaultId } = useParams();

  return (
    <Flex direction={"column"} gap={"16px"}>
      <TopSection />

      <RewardBox>
        <TextLabel>Daily Reward</TextLabel>

        {vaultId &&
          VAULTS_TOKEN_LOGOS[vaultId as keyof typeof VAULTS_TOKEN_LOGOS].map(
            (tokenLogo, idx) => (
              <Flex justify={"between"} align={"center"}>
                <Flex gap={"8px"} align={"center"}>
                  <img
                    src={tokenLogo}
                    alt={"token logo"}
                    width={"36px"}
                    height={"36px"}
                  />
                  <Text size={"1"}>{vaultId.split("-")[idx]}</Text>
                </Flex>
                <Text size={"6"}>17,123,456</Text>
              </Flex>
            )
          )}
      </RewardBox>

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
