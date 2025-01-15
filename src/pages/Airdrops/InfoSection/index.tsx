import { Text } from "@radix-ui/themes";
import React from "react";
import { GradientText, InfoContainer } from "./info-section-styles";

const InfoSection: React.FC = () => {
  return (
    <InfoContainer>
      <Text size={"1"}>
        <span style={{ fontWeight: "700" }}>Not eligible? </span> ;’( Don’t
        worry :) Airdrop 2 campaign is live now
      </Text>
      <Text size={"1"} weight={"medium"}>
        <a
          href="https://mirror.xyz/0x7999C7f0b9f2259434b7aD130bBe36723a49E14e/Q5OmkZ7eXCZ8AgrDy37IaLfTQouVR9R1U3mmiRDDdz8"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <GradientText> Want to learn more?</GradientText>
        </a>
      </Text>
    </InfoContainer>
  );
};

export default InfoSection;
