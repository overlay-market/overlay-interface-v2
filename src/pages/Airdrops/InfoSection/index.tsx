import { Text } from "@radix-ui/themes";
import React from "react";
import { GradientLink, InfoContainer } from "./info-section-styles";
import { AIRDROP_LEARN_MORE_LINK } from "../../../constants/airdrops";

const InfoSection: React.FC = () => {
  return (
    <InfoContainer>
      <Text size={"1"}>
        <span style={{ fontWeight: "700" }}>Not eligible? </span> ;’( Don’t
        worry :) Airdrop 2 campaign is live now
      </Text>
      <Text size={"1"} weight={"medium"}>
        <a
          href={AIRDROP_LEARN_MORE_LINK}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <GradientLink> Learn more</GradientLink>
        </a>
      </Text>
    </InfoContainer>
  );
};

export default InfoSection;
