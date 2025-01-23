import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import {
  AirdropsClaimContainer,
  AirdropsClaimContent,
  AirdropsClaimWrapper,
  ArcBottomImg,
  ArcTopImg,
  CalloutBottomImg,
  CalloutTopImg,
  CatImg,
  GradientBorderBox,
  GradientText,
  HandImg,
  MainBgImg,
} from "./airdrops-claim-styles";
import theme from "../../../theme";
import LogoImg from "../../../assets/images/overlay-logo-only-no-background.png";
import { LineSeparator } from "../EligibilityChecker/eligibility-checker-styles";

type AirdropClaimProps = {};

const AirdropsClaim: React.FC<AirdropClaimProps> = ({}) => {
  return (
    <AirdropsClaimWrapper>
      <Flex
        display={{ initial: "none", sm: "flex", lg: "none" }}
        justify={"start"}
        align={"center"}
        width={"100%"}
        height={theme.headerSize.height}
        px={"10px"}
      >
        <Text size={"2"} weight={"medium"}>
          Airdrops
        </Text>
      </Flex>
      <LineSeparator />

      <AirdropsClaimContainer>
        <MainBgImg />
        <ArcTopImg />
        <HandImg />
        <CalloutTopImg />
        <CalloutBottomImg />
        <CatImg />
        <ArcBottomImg />

        <AirdropsClaimContent>
          <Flex align={"center"} gap={"8px"}>
            <img src={LogoImg} alt="Logo" width={"32px"} height={"32px"} />
            <Text size={"7"} style={{ fontWeight: "600" }}>
              Overlay Airdrop
            </Text>
          </Flex>

          <GradientBorderBox>
            <Text
              size={{ initial: "3", sm: "4" }}
              weight={"bold"}
              style={{ color: "#10DCB1", lineHeight: "19px" }}
            >
              You earned
            </Text>

            <GradientText>
              310,293.13 <span style={{ fontFamily: "Inter" }}>OVL</span>
            </GradientText>
          </GradientBorderBox>
        </AirdropsClaimContent>
      </AirdropsClaimContainer>
    </AirdropsClaimWrapper>
  );
};

export default AirdropsClaim;
