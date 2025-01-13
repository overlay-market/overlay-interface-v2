import { Text } from "@radix-ui/themes";
import React from "react";
import { GradientText, InfoContainer } from "./info-section-styles";

const InfoSection: React.FC = () => {
  return (
    <InfoContainer direction="column">
      <Text size={{ initial: "5", md: "6" }} weight={"bold"}>
        Airdrop 1 Eligibility Checker 🪂
      </Text>
      <Text size={"3"}>
        Check eligibility for Airdrop 1. Airdrop 1 is for{" "}
        <span style={{ fontWeight: "700" }}>
          ex-OVL holders, PlanckCat DAO NFT Holders, Overlay Hoodie buyers,
        </span>{" "}
        and <span style={{ fontWeight: "700" }}>Overlay NFT holders.</span>
      </Text>
      <Text size={"3"}>
        Not eligible? ;’( Don’t worry :)
        <span style={{ fontWeight: "700" }}> Airdrop 2 </span>
        campaign is live now.
        <a
          href="https://mirror.xyz/0x7999C7f0b9f2259434b7aD130bBe36723a49E14e/Q5OmkZ7eXCZ8AgrDy37IaLfTQouVR9R1U3mmiRDDdz8"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <GradientText>
            {" "}
            Check out this article to learn more about Airdrop 2, aka TUNA by
            Overlay.
          </GradientText>{" "}
        </a>
      </Text>
    </InfoContainer>
  );
};

export default InfoSection;
