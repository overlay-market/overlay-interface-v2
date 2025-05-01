import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect } from "react";
import theme from "../../../theme";
import {
  LineSeparator,
  StakeContainer,
  StakeContent,
} from "./stake-page-styles";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import useAccount from "../../../hooks/useAccount";
import InfoSection from "./InfoSection";
import MyStats from "./MyStats";
import TransactSection from "./TransactSection";
import TopSection from "./TopSection";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useCurrentVault } from "../hooks/useCurrentVaultData";

const Stake: React.FC = () => {
  const { vaultId } = useParams();
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const currentVault = useCurrentVault(vaultId);

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const redirectToEarnPage = () => {
    navigate(`/earn`);
  };

  useEffect(() => {
    if (vaultId && !currentVault) {
      console.warn(`Vault with ID ${vaultId} not found`);
      redirectToEarnPage();
    }
  }, [vaultId, currentVault, navigate]);

  return (
    <StakeContainer width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        align={"center"}
        gap={"12px"}
        height={{ initial: "47px", sm: theme.headerSize.height }}
        px={{ initial: "0px", sm: "16px" }}
      >
        <Flex
          gap={"4px"}
          align={"center"}
          px={"4px"}
          style={{ color: theme.color.blue3, cursor: "pointer" }}
          onClick={() => redirectToEarnPage()}
        >
          <ArrowLeftIcon />
          <Text size={"1"} weight={"medium"}>
            Back
          </Text>
        </Flex>

        <Text weight={"medium"}>{vaultId}</Text>
      </Flex>
      <LineSeparator />

      <StakeContent>
        {!isDesktop && <TopSection />}

        {account && <MyStats />}
        <Flex
          gap={"16px"}
          direction={{ initial: "column-reverse", sm: "column", lg: "row" }}
        >
          <Flex direction={"column"} gap={"16px"} style={{ flex: 1 }}>
            {isDesktop && <TopSection />}
            <InfoSection />
          </Flex>

          <TransactSection />
        </Flex>
      </StakeContent>
    </StakeContainer>
  );
};

export default Stake;
