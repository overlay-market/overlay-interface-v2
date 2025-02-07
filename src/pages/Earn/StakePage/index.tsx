import { Flex, Text } from "@radix-ui/themes";
import React from "react";
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

const Stake: React.FC = () => {
  const { vaultId } = useParams();
  const navigate = useNavigate();
  const { address: account } = useAccount();

  const redirectToEarnPage = () => {
    navigate(`/earn`);
  };

  return (
    <StakeContainer width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align={"center"}
        gap={"12px"}
        height={theme.headerSize.height}
        px={"16px"}
      >
        <Flex
          gap={"4px"}
          align={"center"}
          style={{ color: theme.color.blue3, cursor: "pointer" }}
          onClick={() => redirectToEarnPage()}
        >
          <ArrowLeftIcon />
          <Text size={"1"} weight={"medium"}>
            Back
          </Text>
        </Flex>

        <Text weight={"medium"}>{vaultId} Vault</Text>
      </Flex>
      <LineSeparator />

      <StakeContent
        direction={"column"}
        gap={{ initial: "24px", sm: "28px", md: "32px" }}
        pt={"16px"}
        pl={{ initial: "4px", sm: "16px" }}
        pr={{ initial: "4px", sm: "0px" }}
      >
        {account && <MyStats />}
        <Flex gap={"16px"}>
          <Flex style={{ flex: 1 }}>
            <InfoSection />
          </Flex>

          <TransactSection />
        </Flex>
      </StakeContent>
    </StakeContainer>
  );
};

export default Stake;
