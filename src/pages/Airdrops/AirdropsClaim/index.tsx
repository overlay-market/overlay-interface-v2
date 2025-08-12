import { Flex, Text } from "@radix-ui/themes";
import React, { useMemo, useState } from "react";
import {
  AirdropBox,
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
  LineSeparator,
  MainBgImg,
  MobileShadowBox,
  ShareOnXbutton,
} from "./airdrops-claim-styles";
import theme from "../../../theme";
import LogoImg from "../../../assets/images/overlay-logo-only-no-background.webp";
import Xlogo from "../../../assets/images/airdrops/socials-x.webp";
import {
  AIRDROPS,
  MERKLE_DISTIBUTOR_ADDRESSES,
  SABLIER_VESTING_URL,
} from "../../../constants/airdrops";
import { GradientOutlineButton } from "../../../components/Button";
import { AirdropsAmounts } from "../types";
import { GradientLink, StyledLink } from "../EligibilityChecker/eligibility-checker-styles";
import { GradientOpenInNewIcon } from "../../../assets/icons/svg-icons";

type AirdropClaimProps = {
  airdropsAmounts: AirdropsAmounts | null;
};

const AirdropsClaim: React.FC<AirdropClaimProps> = ({ airdropsAmounts }) => {
  const [airdropIdForErrorClaimAlias, setAirdropIdForErrorClaimAlias] =
    useState<string | null>(null);

  const totalAmount = useMemo(() => {
    if (airdropsAmounts) {
      const total = Object.values(airdropsAmounts)
        .map((value) => parseFloat(value))
        .reduce((sum, current) => sum + current, 0);
      return total;
    } else {
      return null;
    }
  }, [airdropsAmounts]);

  // const handleStake = () => {
  //   console.log("Stake");
  // };

  const handleClaim = (airdropId: string) => {
    setAirdropIdForErrorClaimAlias(null);
    const alias = MERKLE_DISTIBUTOR_ADDRESSES[airdropId];

    if (alias) {
      const url = `${SABLIER_VESTING_URL}${alias}`;
      window.open(url, "_blank");
    } else {
      setAirdropIdForErrorClaimAlias(airdropId);
    }
  };

  const handleShareOnX = () => {
    const shareText = `I just got my $OVL airdrop from @overlaymarket! ${totalAmount} $OVL 🚀🔥 \n\nCheck yours and start trading today at app.overlay.market/airdrops`;

    const XshareUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      shareText
    )}`;

    window.open(XshareUrl, "_blank");
  };

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
          <Flex
            align={"center"}
            gap={"8px"}
            position={"relative"}
            style={{ zIndex: "60" }}
          >
            <img src={LogoImg} alt="Logo" width={"32px"} height={"32px"} />
            <Text
              size={{ initial: "6", sm: "7" }}
              style={{ fontWeight: "600" }}
            >
              Overlay Airdrop
            </Text>
          </Flex>
          <MobileShadowBox>
            <GradientBorderBox>
              {totalAmount && (
                <>
                  <Text
                    size={{ initial: "3", sm: "4" }}
                    weight={"bold"}
                    style={{ color: "#10DCB1", lineHeight: "19px" }}
                  >
                    You earned
                  </Text>

                  <GradientText>
                    {totalAmount}{" "}
                    <span style={{ fontFamily: "Inter" }}>OVL</span>
                  </GradientText>
                </>
              )}
            </GradientBorderBox>

            {totalAmount !== null && totalAmount > 0 && (
              <ShareOnXbutton onClick={handleShareOnX}>
                <Text>Share on</Text>
                <img src={Xlogo} alt="Xlogo" width={"16px"} height={"16px"} />
              </ShareOnXbutton>
            )}

            {airdropsAmounts &&
              Object.keys(airdropsAmounts).map((airdropId) => (
                <AirdropBox key={airdropId}>
                  <Flex
                    direction={{ initial: "column", sm: "row" }}
                    gap={"8px"}
                    width={"100%"}
                    align={{ initial: "start", sm: "center" }}
                    justify={"end"}
                  >
                    <Text
                      size={"3"}
                      style={{ color: theme.color.white }}
                      weight={"medium"}
                    >
                      {AIRDROPS[airdropId].title}
                    </Text>
                    <Text
                      ml={{ initial: "0", sm: "auto" }}
                      size={"5"}
                      style={{
                        color: theme.color.white,
                        fontFamily: "Roboto Mono",
                      }}
                    >
                      {airdropsAmounts[airdropId]}{" "}
                      <span style={{ fontFamily: "Inter" }}>OVL</span>
                    </Text>
                    <Flex gap={"4px"}>
                      {/* <GradientSolidButton
                        title={"Stake"}
                        width={"73px"}
                        height={"32px"}
                        size={"12px"}
                        handleClick={handleStake}
                      /> */}
                      <GradientOutlineButton
                        title={"Claim"}
                        width={"73px"}
                        height={"32px"}
                        size={"12px"}
                        handleClick={() => handleClaim(airdropId)}
                      />
                    </Flex>
                  </Flex>
                  {airdropIdForErrorClaimAlias === airdropId && (
                    <Text
                      size={"1"}
                      weight={"medium"}
                      style={{
                        color: theme.color.red1,
                      }}
                    >
                      An error occurred. Please contact the team.
                    </Text>
                  )}
                </AirdropBox>
              ))}

            <InfoBox>
              <Text size={"1"} style={{ lineHeight: "14.5px" }} weight={"bold"}>
                Wondering what to do with your shiny new $OVL?
              </Text>

              <StyledLink
                to={"/markets"}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <GradientLink> Trade </GradientLink>
                <GradientOpenInNewIcon />
              </StyledLink>
            </InfoBox>
          </MobileShadowBox>
        </AirdropsClaimContent>
      </AirdropsClaimContainer>
    </AirdropsClaimWrapper>
  );
};

export default AirdropsClaim;
