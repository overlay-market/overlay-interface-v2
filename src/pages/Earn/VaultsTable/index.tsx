import { Flex, Text } from "@radix-ui/themes";
import { StyledHeader, StyledTable } from "./vaults-table-styles";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import useAccount from "../../../hooks/useAccount";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import VaultRow from "./VaultRaw";
import { VAULTS } from "../../../constants/vaults";

const VaultsTable: React.FC = () => {
  const { address: account } = useAccount();

  // const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledHeader textalign={"left"} style={{ paddingLeft: "0" }}>
            <Text size={"2"} style={{ color: theme.color.grey10 }}>
              STAKE
            </Text>
          </StyledHeader>
          <StyledHeader textalign={"right"}>APR</StyledHeader>
          {account && !isMobile && (
            <StyledHeader textalign={"right"}>My Rewards</StyledHeader>
          )}
          <StyledHeader textalign={"right"}>TVL</StyledHeader>

          {!isMobile && (
            <StyledHeader textalign={"right"}>Rewards</StyledHeader>
          )}
        </tr>
      </thead>

      <tbody>
        {VAULTS &&
          VAULTS.map((vault) => (
            <VaultRow key={vault.vaultName} vault={vault} />
          ))}

        {!VAULTS && (
          <tr>
            <td colSpan={4}>
              <Flex
                justify={"center"}
                width={"100%"}
                height={"100px"}
                align={"center"}
              >
                <Loader />
              </Flex>
            </td>
          </tr>
        )}
      </tbody>
    </StyledTable>
  );
};

export default VaultsTable;
