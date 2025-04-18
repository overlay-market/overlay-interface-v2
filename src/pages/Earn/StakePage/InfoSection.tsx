import { Flex } from "@radix-ui/themes";
import React, { useMemo } from "react";
import {
  InfoBox,
  RewardBox,
  TextLabel,
  TextValue,
} from "./info-section-styles";
import theme from "../../../theme";
import { useParams } from "react-router-dom";
import { getVaultAddressByVaultName } from "../utils/currentVaultdata";
import {
  useCurrentVault,
  useCurrentVaultDetails,
} from "../hooks/useCurrentVaultData";
import { Address } from "viem";
import { TOKEN_LOGOS } from "../../../constants/vaults";

const InfoSection: React.FC = () => {
  const { vaultId } = useParams();

  const vaultAddress = getVaultAddressByVaultName(vaultId) as Address;
  const currentVault = useCurrentVault(vaultAddress);
  const currentVaultDetails = useCurrentVaultDetails(vaultAddress);

  const totalSupply = currentVaultDetails?.tvl.toLocaleString() ?? "";

  const tokenLogos = useMemo(() => {
    if (!currentVault) return [];

    const logos = currentVault.rewardTokens
      .map((token) => TOKEN_LOGOS[token.rewardTokenName])
      .filter(Boolean);

    return logos;
  }, [currentVault]);

  return (
    <Flex direction={"column"} gap={"16px"}>
      <RewardBox>
        <TextLabel>Daily Reward</TextLabel>

        <Flex
          direction={{ initial: "column", sm: "row", lg: "column" }}
          justify={"between"}
          gap={{ initial: "8px", sm: "20px", lg: "8px" }}
        >
          {vaultId &&
            tokenLogos.map((logo, idx) => (
              <Flex
                justify={"between"}
                align={"center"}
                width={"100%"}
                key={idx}
              >
                <img
                  src={logo}
                  alt={"token logo"}
                  width={"36px"}
                  height={"36px"}
                />
              </Flex>
            ))}
        </Flex>
      </RewardBox>

      <Flex
        direction={{ initial: "column", sm: "row", lg: "column" }}
        gap={"16px"}
      >
        <InfoBox>
          <TextLabel>TVL</TextLabel>
          <TextValue>{totalSupply} OVL</TextValue>
        </InfoBox>
        <InfoBox>
          <TextLabel>APY</TextLabel>
          <TextValue style={{ color: theme.color.green2 }}>5.2%</TextValue>
        </InfoBox>
      </Flex>
    </Flex>
  );
};

export default InfoSection;
