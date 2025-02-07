import { Flex, Text } from "@radix-ui/themes";
import {
  StyledCell,
  StyledHeader,
  StyledRow,
  StyledTable,
} from "./stake-table-styles";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import { useNavigate } from "react-router-dom";
import useAccount from "../../../hooks/useAccount";

const StakeTable: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();

  const vaults = [
    {
      vaultId: "USDC-OVL",
      apr: "20.3%",
      tvl: "$120,000,000",
      lockPeriod: "30 Days",
      rewards: ["USDC", "OVL"],
    },
    {
      vaultId: "OVL",
      apr: "24.3%",
      tvl: "$120,000,000",
      lockPeriod: "30 Days",
      rewards: ["OVL"],
    },
  ];

  const myRewards: Record<string, string[]> = {
    "USDC-OVL": ["1.25 USDC", "123 OVL"],
    OVL: ["1.25 OVL"],
  };

  const redirectToStakePage = (vaultId: string) => {
    navigate(`/earn/${encodeURIComponent(vaultId)}`);
  };

  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledHeader textalign={"left"}>
            <Text size={"2"} style={{ color: theme.color.grey10 }}>
              STAKE
            </Text>
          </StyledHeader>
          <StyledHeader textalign={"right"}>APR</StyledHeader>
          {account && (
            <StyledHeader textalign={"right"}>My Rewards</StyledHeader>
          )}
          <StyledHeader textalign={"right"}>TVL</StyledHeader>
          {/* <StyledHeader textalign={"right"}>Lock-up Period</StyledHeader> */}
          <StyledHeader textalign={"right"}>Rewards</StyledHeader>
        </tr>
      </thead>

      <tbody>
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
        {vaults &&
          vaults.map((vault, index) => (
            <StyledRow
              key={index}
              onClick={() => redirectToStakePage(vault.vaultId)}
            >
              <StyledCell textalign="left">
                <Text weight={"medium"}>{vault.vaultId} Vault</Text>
              </StyledCell>
              <StyledCell textalign="right">
                <Text>{vault.apr}</Text>
              </StyledCell>
              {account && (
                <StyledCell textalign="right">
                  <Flex direction={"column"}>
                    {myRewards &&
                      myRewards[vault.vaultId as keyof typeof myRewards]
                        ?.length > 0 &&
                      myRewards[vault.vaultId as keyof typeof myRewards].map(
                        (reward, i) => (
                          <Text key={i} style={{ color: theme.color.green2 }}>
                            {reward}
                          </Text>
                        )
                      )}
                  </Flex>
                </StyledCell>
              )}
              <StyledCell textalign="right">
                <Text>{vault.tvl}</Text>
              </StyledCell>
              {/* <StyledCell textalign="right">
                <Text>{vault.lockPeriod}</Text>
              </StyledCell> */}
              <StyledCell textalign="right">
                <Text>{vault.rewards.join(" / ")}</Text>
              </StyledCell>
            </StyledRow>
          ))}
      </tbody>
    </StyledTable>
  );
};

export default StakeTable;
