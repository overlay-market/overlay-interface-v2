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
  ClaimId,
  MERKLE_DISTIBUTOR_ADDRESSES,
  SABLIER_VESTING_URL,
} from "../../../constants/airdrops";
import { GradientOutlineButton } from "../../../components/Button";
import { AirdropsAmounts } from "../types";
import {
  GradientLink,
  StyledLink,
} from "../EligibilityChecker/eligibility-checker-styles";
import { GradientOpenInNewIcon } from "../../../assets/icons/svg-icons";
import useAccount from "../../../hooks/useAccount";
import { trackEvent } from "../../../analytics/trackEvent";

type AirdropClaimProps = {
  airdropsAmounts: AirdropsAmounts | null;
  disqualifiedTorch: Boolean | null;
};

const AirdropsClaim: React.FC<AirdropClaimProps> = ({
  airdropsAmounts,
  disqualifiedTorch,
}) => {
  const { address } = useAccount();
  const [airdropIdForErrorClaimAlias, setAirdropIdForErrorClaimAlias] =
    useState<string | null>(null);

  const totalAmount = useMemo(() => {
    if (airdropsAmounts) {
      const total = Object.values(airdropsAmounts)
        .map((value) => parseFloat(value))
        .reduce((sum, current) => sum + current, 0);
      return total.toFixed(2);
    } else {
      return null;
    }
  }, [airdropsAmounts]);

  // const handleStake = () => {
  //   console.log("Stake");
  // };

  const handleClaim = (airdropId: string) => {
    setAirdropIdForErrorClaimAlias(null);

    trackEvent("airdrop_claim_click", {
      wallet_address: address,
      airdrop_id: airdropId,
      disqualified: disqualifiedTorch,
      total_amount: totalAmount,
      timestamp: new Date().toISOString(),
    });

    const alias = MERKLE_DISTIBUTOR_ADDRESSES[airdropId];

    if (alias) {
      let url;
      if (alias.startsWith("0x")) {
        url = `${SABLIER_VESTING_URL}${alias}`;
      } else {
        url = alias;
      }
      window.open(url, "_blank");
    } else {
      setAirdropIdForErrorClaimAlias(airdropId);
    }
  };

  const handleShareOnX = () => {
    const shareText = `I just got my $OVL airdrop from @OverlayProtocol! ${totalAmount} $OVL 🚀🔥 \n\nCheck yours and start trading today at app.overlay.market/airdrops`;

    trackEvent("airdrop_share_on_x", {
      wallet_address: address,
      total_amount: totalAmount,
      timestamp: new Date().toISOString(),
    });

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
                  {!disqualifiedTorch && (
                    <Text
                      size={{ initial: "3", sm: "4" }}
                      weight={"bold"}
                      style={{ color: "#10DCB1", lineHeight: "19px" }}
                    >
                      You earned
                    </Text>
                  )}

                  <GradientText
                    style={{
                      color: disqualifiedTorch ? theme.color.grey10 : undefined,
                      background: disqualifiedTorch ? "none" : undefined,
                      backgroundClip: disqualifiedTorch ? "unset" : undefined,
                      WebkitBackgroundClip: disqualifiedTorch
                        ? "unset"
                        : undefined,
                      WebkitTextFillColor: disqualifiedTorch
                        ? theme.color.grey10
                        : "transparent",
                    }}
                  >
                    {totalAmount}{" "}
                    <span style={{ fontFamily: "Inter" }}>OVL</span>
                  </GradientText>
                </>
              )}
            </GradientBorderBox>

            {totalAmount !== null && +totalAmount > 0 && (
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
                      {airdropId === ClaimId.TORCH
                        ? disqualifiedTorch
                          ? " - DISQUALIFIED"
                          : " - QUALIFIED"
                        : ""}
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
                      {MERKLE_DISTIBUTOR_ADDRESSES[airdropId] && (
                        <GradientOutlineButton
                          title={
                            airdropId === ClaimId.TORCH
                              ? `How to ${
                                  disqualifiedTorch ? "Appeal" : "Claim"
                                }`
                              : "Claim"
                          }
                          height={"32px"}
                          size={"12px"}
                          handleClick={() => handleClaim(airdropId)}
                        />
                      )}
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
                  {!MERKLE_DISTIBUTOR_ADDRESSES[airdropId] &&
                    !AIRDROPS[airdropId].subtitle && (
                      <Text
                        size={"1"}
                        weight={"medium"}
                        style={{
                          color: theme.color.white,
                        }}
                      >
                        {AIRDROPS[airdropId].subtitle ??
                          "Available after [redacted]"}
                      </Text>
                    )}
                  {AIRDROPS[airdropId].subtitle && (
                    <Text
                      size={"1"}
                      weight={"medium"}
                      style={{
                        color: theme.color.white,
                      }}
                    >
                      {AIRDROPS[airdropId].subtitle}
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
                <GradientLink> Trade and Earn </GradientLink>
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
