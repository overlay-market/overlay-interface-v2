import { Flex, Text } from "@radix-ui/themes";
import {
  StyledCell,
  StyledHeader,
  StyledRow,
  StyledTable,
  TokenImg,
} from "./stake-table-styles";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import { useNavigate } from "react-router-dom";
import useAccount from "../../../hooks/useAccount";
import { VAULTS_TOKEN_LOGOS } from "../../../constants/stake";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const StakeTable: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

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
    {
      vaultId: "BERA-OVL",
      apr: "14.3%",
      tvl: "$120,000,000",
      lockPeriod: "30 Days",
      rewards: ["BGT", "OVL"],
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
            <StyledHeader textalign={"right"}>Rewards</StyledHeader>
          )}
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
                <Flex gap={"8px"} align={"center"}>
                  <Flex
                    width={{ initial: "34px", lg: "62px" }}
                    justify={"center"}
                  >
                    {VAULTS_TOKEN_LOGOS[
                      vault.vaultId as keyof typeof VAULTS_TOKEN_LOGOS
                    ].map((tokenLogo) => (
                      <TokenImg src={tokenLogo} alt={"token logo"} />
                    ))}
                  </Flex>
                  <Flex
                    px={{ initial: "8px", lg: "10px" }}
                    py={{ initial: "4px", sm: "12px" }}
                  >
                    <Text weight={"medium"} style={{ lineHeight: "17px" }}>
                      {isDesktop || vault.vaultId.split("-").length === 1 ? (
                        `${vault.vaultId} Vault`
                      ) : (
                        <Flex direction={"column"}>
                          <span>{vault.vaultId.split("-")[0]}</span>
                          <span>{vault.vaultId.split("-")[1]} Vault</span>
                        </Flex>
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </StyledCell>

              <StyledCell textalign="right">
                <Text>{vault.apr}</Text>
              </StyledCell>

              {account && !isMobile && (
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

              {/* {!isMobile && (
                <StyledCell textalign="right">
                  <Text>{vault.lockPeriod}</Text>
                </StyledCell>
              )} */}

              {!isMobile && (
                <StyledCell textalign="right">
                  <Text>{vault.rewards.join(" / ")}</Text>
                </StyledCell>
              )}
            </StyledRow>
          ))}
      </tbody>
    </StyledTable>
  );
};

export default StakeTable;
