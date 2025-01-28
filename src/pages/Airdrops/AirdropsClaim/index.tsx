import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
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
import LogoImg from "../../../assets/images/overlay-logo-only-no-background.png";
import {
  GradientLink,
  StyledLink,
} from "../EligibilityChecker/eligibility-checker-styles";
import Xlogo from "../../../assets/images/airdrops/socials-x.png";
import { GradientOpenInNewIcon } from "../../../assets/icons/svg-icons";
import {
  AIRDROP_LEARN_MORE_LINK,
  AIRDROPS,
  MERKLE_DISTIBUTOR_ADDRESSES,
  SABLIER_SUBGRAPH_URL,
  SABLIER_VESTING_URL,
} from "../../../constants/airdrops";
import {
  GradientOutlineButton,
  GradientSolidButton,
} from "../../../components/Button";
import { AirdropsAmounts } from "../types";
import { MyQueryResponse, queryDocument, StreamData } from "./subgraphTypes";
import { GraphQLClient } from "graphql-request";

type AirdropClaimProps = {
  airdropsAmounts: AirdropsAmounts | null;
};

const AirdropsClaim: React.FC<AirdropClaimProps> = ({ airdropsAmounts }) => {
  // const { address: account } = useAccount();
  const account = "0x55176a12ba096f60810fd74b90d1b1138b595ede";

  const [streamData, setStreamData] = useState<StreamData | null>(null);

  const client = new GraphQLClient(SABLIER_SUBGRAPH_URL);

  useEffect(() => {
    const fetchStreams = async (recipient: string) => {
      try {
        const variables = { recipient };
        const response = await client.request<MyQueryResponse>(
          queryDocument,
          variables
        );

        setStreamData(response.streams);
      } catch (error) {
        console.log(error);
        setStreamData(null);
      }
    };

    account && fetchStreams(account.toLowerCase());
  }, [account]);

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

  const handleStake = () => {
    console.log("Stake");
  };

  const handleClaim = (airdropId: string) => {
    const alias =
      streamData &&
      streamData.find(
        (item) =>
          item.sender.toLowerCase() ===
          MERKLE_DISTIBUTOR_ADDRESSES[airdropId].toLowerCase()
      )?.alias;

    const url = `${SABLIER_VESTING_URL}${alias}`;
    window.open(url, "_blank");
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
              {totalAmount ? (
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
              ) : (
                <Text
                  size={{ initial: "3", sm: "4" }}
                  weight={"bold"}
                  style={{ color: theme.color.red1, lineHeight: "19px" }}
                >
                  An error occurred. Please contact the team.
                </Text>
              )}
            </GradientBorderBox>

            <ShareOnXbutton>
              <Text>Share on</Text>
              <img src={Xlogo} alt="Xlogo" width={"16px"} height={"16px"} />
            </ShareOnXbutton>

            {airdropsAmounts &&
              Object.keys(airdropsAmounts).map((airdropId) => (
                <AirdropBox>
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
                      <GradientSolidButton
                        title={"Stake"}
                        width={"73px"}
                        height={"32px"}
                        size={"12px"}
                        handleClick={handleStake}
                      />
                      <GradientOutlineButton
                        title={"Claim"}
                        width={"73px"}
                        height={"32px"}
                        size={"12px"}
                        handleClick={() => handleClaim(airdropId)}
                      />
                    </Flex>
                  </Flex>
                  <Text
                    size={"1"}
                    style={{ lineHeight: "14.5px" }}
                    weight={"medium"}
                  >
                    Note: 25% vested at TGE and 75% vested upon CEX listing of
                    OVL
                  </Text>
                </AirdropBox>
              ))}

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
          </MobileShadowBox>
        </AirdropsClaimContent>
      </AirdropsClaimContainer>
    </AirdropsClaimWrapper>
  );
};

export default AirdropsClaim;
