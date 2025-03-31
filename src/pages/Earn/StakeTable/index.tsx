import { Flex, Text } from "@radix-ui/themes";
import { StyledHeader, StyledTable } from "./stake-table-styles";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import useAccount from "../../../hooks/useAccount";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useVaultsState } from "../../../state/vaults/hooks";
import StakeRow from "./StakeRow";

const StakeTable: React.FC = () => {
  const { address: account } = useAccount();
  const { vaults } = useVaultsState();

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
          <StyledHeader textalign={"right"}>APY</StyledHeader>
          {account && !isMobile && (
            <StyledHeader textalign={"right"}>My Rewards</StyledHeader>
          )}
          <StyledHeader textalign={"right"}>TVL</StyledHeader>
          {/* {!isMobile && (
            <StyledHeader textalign={"right"}>
              Lock-up {!isDesktop && <br />} Period
            </StyledHeader>
          )} */}
          {!isMobile && (
            <StyledHeader textalign={"right"}>Daily Rewards</StyledHeader>
          )}
        </tr>
      </thead>

      <tbody>
        {vaults &&
          vaults.map((vault) => (
            <StakeRow key={vault.stakingPool} vault={vault} />
          ))}

        {!vaults && (
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

export default StakeTable;
