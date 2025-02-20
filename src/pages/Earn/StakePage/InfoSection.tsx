import { Flex, Text } from "@radix-ui/themes";
import React, { useMemo } from "react";
import {
  InfoBox,
  RewardBox,
  TextLabel,
  TextValue,
} from "./info-section-styles";
import theme from "../../../theme";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import {
  getTokenLogo,
  getVaultAddressByVaultName,
} from "../utils/currentVaultdata";
import {
  useCurrentVault,
  useCurrentVaultDetails,
} from "../hooks/useCurrentVaultData";
import { formatReward } from "../utils/formatReward";

const InfoSection: React.FC = () => {
  const { vaultId } = useParams();
  const { chainId } = useMultichainContext();

  const vaultAddress = getVaultAddressByVaultName(chainId, vaultId);
  const currentVault = useCurrentVault(vaultAddress);
  const currentVaultDetails = useCurrentVaultDetails(vaultAddress);

  const totalSupply = currentVaultDetails?.totalSupply.toLocaleString() ?? "";

  const tokenLogos = useMemo(() => {
    if (!currentVault) return [];

    const logos = [
      getTokenLogo(currentVault.rewardTokenADetail),
      currentVault.isDualFactory && currentVault.rewardTokenBDetail
        ? getTokenLogo(currentVault.rewardTokenBDetail)
        : undefined,
    ].filter(Boolean);

    return logos;
  }, [currentVault]);

  const dailyRewards = useMemo(() => {
    if (!currentVault) return [];

    const rewards = [
      formatReward(
        currentVault.dailyEmissionRewardA,
        currentVault.rewardTokenADetail
      ),
      currentVault.isDualFactory && currentVault.rewardTokenBDetail
        ? formatReward(
            currentVault.dailyEmissionRewardB,
            currentVault.rewardTokenBDetail
          )
        : null,
    ]
      .filter(
        (reward): reward is string => reward !== null && reward !== undefined
      )
      .map((reward, index) => {
        const [amount, symbol] = reward.split(" ");
        return { amount, symbol, logo: tokenLogos[index] };
      });

    return rewards;
  }, [currentVault, tokenLogos]);

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
            dailyRewards.map((reward) => (
              <Flex justify={"between"} align={"center"} width={"100%"}>
                <Flex gap={"8px"} align={"center"}>
                  <img
                    src={reward.logo}
                    alt={"token logo"}
                    width={"36px"}
                    height={"36px"}
                  />
                  <Text size={"1"}>{reward.symbol}</Text>
                </Flex>
                <Text size={"6"}>{reward.amount}</Text>
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
