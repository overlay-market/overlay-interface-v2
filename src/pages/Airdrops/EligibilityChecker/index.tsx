import { Flex, Text } from "@radix-ui/themes";
import React, { Dispatch, SetStateAction } from "react";
import {
  BummerContainer,
  DisabledButton,
  GradientBorderBox,
  GradientLink,
  InfoContainer,
  LineSeparator,
  StyledInput,
  StyledLink,
} from "./eligibility-checker-styles";
import { AIRDROP_LEARN_MORE_LINK } from "../../../constants/airdrops";
import { GradientOpenInNewIcon } from "../../../assets/icons/svg-icons";
import theme from "../../../theme";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import { EligibilityStatus } from "..";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

type EligibilityCheckerProps = {
  eligibilityStatus: EligibilityStatus;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleAddressesCheck: () => Promise<void>;
};

const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  eligibilityStatus,
  address,
  setAddress,
  loading,
  handleAddressesCheck,
}) => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      <LineSeparator />

      <Flex
        width={"100%"}
        height={"100%"}
        direction={"column"}
        pt={{ initial: "16px", sm: "0" }}
        justify={"start"}
        align={"center"}
      >
        <Flex
          direction={"column"}
          width={{ initial: "343px", sm: "424px", lg: "459px" }}
          mt={{ sm: "120px", lg: "100px" }}
          mb={"100px"}
          gap={{ initial: "32px", sm: "28px" }}
        >
          <Text
            style={{ fontWeight: "600", textAlign: "center" }}
            size={{ initial: "6", sm: "8" }}
          >
            Airdrop <br /> Eligibility Checker 🪂
          </Text>
          <GradientBorderBox
            bordercolor={
              eligibilityStatus === "ineligible" && isDesktop
                ? theme.color.grey11
                : ""
            }
          >
            <Flex
              direction={"column"}
              width={"100%"}
              gap={"16px"}
              p={{ sm: "32px" }}
            >
              <Flex
                direction={"column"}
                gap="8px"
                align={{ initial: "center", sm: "start" }}
              >
                <Text size={"4"} weight={"bold"} style={{ lineHeight: "21px" }}>
                  Enter address to check
                </Text>
                <Text size={"1"} style={{ color: theme.color.grey10 }}>
                  ENS is ok
                </Text>
              </Flex>

              <StyledInput
                type="text"
                value={address}
                disabled={loading}
                onChange={(e) => setAddress(e.target.value.trim())}
                placeholder="Enter address"
              />

              <Flex>
                {loading ? (
                  <GradientLoaderButton
                    title={"Checking address ..."}
                    height="49px"
                    width="100%"
                  />
                ) : address.length === 0 && isDesktop ? (
                  <DisabledButton>Check address</DisabledButton>
                ) : (
                  <GradientSolidButton
                    title="Check address"
                    size={"14px"}
                    height="49px"
                    width="100%"
                    isDisabled={address.length === 0}
                    handleClick={() => {
                      address && handleAddressesCheck();
                    }}
                  />
                )}
              </Flex>
            </Flex>
          </GradientBorderBox>

          {eligibilityStatus === "ineligible" && (
            <BummerContainer>
              <Text size={"4"} weight={"bold"} style={{ lineHeight: "21px" }}>
                Bummer!
              </Text>
              <Text
                size={"1"}
                style={{ color: theme.color.grey10, lineHeight: "14px" }}
              >
                This address is not eligible.
              </Text>
            </BummerContainer>
          )}

          {eligibilityStatus === "eligibleNoRewards" && (
            <BummerContainer>
              <Text size={"4"} weight={"bold"} style={{ lineHeight: "21px" }}>
                Bummer!
              </Text>
              <Text
                size={"1"}
                style={{ color: theme.color.grey10, lineHeight: "14px" }}
              >
                No allocation reserved for this address.
              </Text>
            </BummerContainer>
          )}

          {(eligibilityStatus === "ineligible" ||
            eligibilityStatus === "eligibleNoRewards") && (
            <InfoContainer>
              <Text size={"1"} style={{ lineHeight: "14.5px" }}>
                <span style={{ fontWeight: "700" }}>Didn’t make the cut?</span>{" "}
                <br />
                <span style={{ fontWeight: "200" }}>
                  Airdrop 2 campaign is now live.
                </span>
              </Text>

              <StyledLink
                to={AIRDROP_LEARN_MORE_LINK}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <GradientLink> Don’t miss out</GradientLink>
                <GradientOpenInNewIcon />
              </StyledLink>
            </InfoContainer>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EligibilityChecker;
