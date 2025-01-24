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
  InfoBox,
  MainBgImg,
  ShareOnXbutton,
} from "./airdrops-claim-styles";
import theme from "../../../theme";
import LogoImg from "../../../assets/images/overlay-logo-only-no-background.png";
import {
  GradientLink,
  LineSeparator,
  StyledLink,
} from "../EligibilityChecker/eligibility-checker-styles";
import Xlogo from "../../../assets/images/airdrops/socials-x.png";
import { GradientOpenInNewIcon } from "../../../assets/icons/svg-icons";
import { AIRDROP_LEARN_MORE_LINK } from "../../../constants/airdrops";
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
          <ShareOnXbutton>
            <Text>Share on</Text>
            <img src={Xlogo} alt="Xlogo" width={"16px"} height={"16px"} />
          </ShareOnXbutton>

          <InfoBox>
            <Text size={"1"} style={{ lineHeight: "14.5px" }} weight={"bold"}>
              Airdrop 2 campaign is now live.
            </Text>

            <StyledLink
              to={AIRDROP_LEARN_MORE_LINK}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <GradientLink> Don’t miss out</GradientLink>
              <GradientOpenInNewIcon />
            </StyledLink>
          </InfoBox>
        </AirdropsClaimContent>
      </AirdropsClaimContainer>
    </AirdropsClaimWrapper>
  );
};

export default AirdropsClaim;
