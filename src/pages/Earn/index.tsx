import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect } from "react";
import theme from "../../theme";
import { EarnContainer, EarnContent, LineSeparator } from "./earn-styles";
import Overview from "./Overview";
import Rewards from "./Rewards";
import StakeTable from "./StakeTable";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import { useVaultsActionHandlers } from "../../state/vaults/hooks";
import { useVaults } from "./hooks/useVaults";
import { useVaultDetails } from "./hooks/useVaultDetails";

const Earn: React.FC = () => {
  const { chainId } = useMultichainContext();
  const { handleVaultsUpdate, handleVaultDetailsUpdate } =
    useVaultsActionHandlers();

  const vaults = useVaults();
  const vaultsDetails = useVaultDetails(vaults);

  useEffect(() => {
    if (vaults) {
      handleVaultsUpdate(vaults);
    }
  }, [chainId, vaults]);

  useEffect(() => {
    if (vaultsDetails) {
      handleVaultDetailsUpdate(vaultsDetails);
    }
  }, [chainId, vaults, vaultsDetails]);

  return (
    <EarnContainer width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align={"center"}
        height={theme.headerSize.height}
        px={"16px"}
      >
        <Text size={"2"} weight={"medium"}>
          Earn
        </Text>
      </Flex>
      <LineSeparator />

      <EarnContent>
        <Overview />
        <Rewards />
        <StakeTable />
      </EarnContent>
    </EarnContainer>
  );
};

export default Earn;
