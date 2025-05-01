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
import {
  useCurrentVault,
  useCurrentVaultDetails,
} from "../hooks/useCurrentVaultData";

const InfoSection: React.FC = () => {
  const { vaultId } = useParams();

  const currentVault = useCurrentVault(vaultId);

  if (!currentVault) {
    return null;
  }

  const currentVaultDetails = useCurrentVaultDetails(currentVault?.id);

  const tvl = useMemo(() => {
    return currentVaultDetails
      ? `$${Number(currentVaultDetails.tvl).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`
      : null;
  }, [currentVaultDetails]);

  const totalApr = useMemo(() => {
    return currentVaultDetails
      ? `${Number(currentVaultDetails.totalApr).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`
      : null;
  }, [currentVaultDetails]);

  const ichiApr = useMemo(() => {
    return currentVaultDetails
      ? `${Number(currentVaultDetails.ichiApr ?? 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`
      : null;
  }, [currentVaultDetails]);

  const rewardsApr = useMemo(() => {
    return currentVaultDetails
      ? `${Number(currentVaultDetails.multiRewardApr ?? 0).toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )}%`
      : null;
  }, [currentVaultDetails]);

  return (
    <Flex direction={"column"} gap={"16px"}>
      <Flex
        direction={{ initial: "column", sm: "row", lg: "column" }}
        gap={"16px"}
      >
        <InfoBox>
          <TextLabel>TVL</TextLabel>
          <TextValue>{tvl} </TextValue>
        </InfoBox>
      </Flex>

      <RewardBox>
        <Flex justify={"between"} align={"center"}>
          <TextLabel>Total return</TextLabel>
          <TextValue style={{ color: theme.color.green2 }}>
            {totalApr}
          </TextValue>
        </Flex>

        <Flex justify={"between"} align={"center"} width={"100%"}>
          <TextLabel>Strategy yield</TextLabel>
          <TextValue>{ichiApr}</TextValue>
        </Flex>
        <Flex justify={"between"} align={"center"} width={"100%"}>
          <TextLabel>Rewards yield</TextLabel>
          <TextValue>{rewardsApr}</TextValue>
        </Flex>
      </RewardBox>
    </Flex>
  );
};

export default InfoSection;
