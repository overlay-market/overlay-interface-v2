import { Text } from "@radix-ui/themes";
import React from "react";
import { useParams } from "react-router-dom";
import {
  ApyBadge,
  ApyBagdeText,
  RewardBox,
  TitleText,
} from "./top-section-styles";

const TopSection: React.FC = () => {
  const { vaultId } = useParams();

  return (
    <RewardBox>
      <ApyBadge>
        <ApyBagdeText>Variable APY</ApyBagdeText>
      </ApyBadge>

      <TitleText>{vaultId} VAULT</TitleText>
      <Text size={"1"} style={{ color: "#F2F2F2", lineHeight: "15px" }}>
        Deposit Kodiak v3 USDC/OVL LP Token {vaultId}. Earn daily rewards based
        on your staked amount. This reward is distributed automatically to your
        staking balance, ensuring passive income.
      </Text>
    </RewardBox>
  );
};

export default TopSection;
