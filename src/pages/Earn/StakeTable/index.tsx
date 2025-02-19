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
import { ACTIVE_VAULTS, VAULTS_TOKEN_LOGOS } from "../../../constants/stake";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useVaultsState } from "../../../state/vaults/hooks";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";

const StakeTable: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { chainId } = useMultichainContext();
  const { vaults, vaultDetails } = useVaultsState();

  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const chainVaultNames = ACTIVE_VAULTS[chainId as number] || [];

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
          {!isMobile && (
            <StyledHeader textalign={"right"}>
              Lock-up {!isDesktop && <br />} Period
            </StyledHeader>
          )}
          {!isMobile && (
            <StyledHeader textalign={"right"}>Daily Rewards</StyledHeader>
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
          vaults.map((vault) => {
            const vaultId = vault.stakingPool.toLowerCase();
            const matchedVault = chainVaultNames.find(
              (v) => v.vaultAddress.toLowerCase() === vaultId
            )!;
            const vaultName = matchedVault.vaultName;
            const details = vaultDetails?.find(
              (detail) => detail.vaultAddress.toLowerCase() === vaultId
            );
            const totalSupply = details?.totalSupply.toLocaleString() ?? "";
            const userRewardsObject = details?.userRewards;
            const userRewards: string[] = [];

            if (userRewardsObject) {
              Object.entries(userRewardsObject).forEach(([key, reward]) => {
                if (key === "rewardA") {
                  userRewards.push(
                    `${reward.toLocaleString()} ${
                      vault.rewardTokenADetail.symbol
                    }`
                  );
                } else if (
                  key === "rewardB" &&
                  vault.isDualFactory &&
                  vault.rewardTokenBDetail
                ) {
                  userRewards.push(
                    `${reward.toLocaleString()} ${
                      vault.rewardTokenBDetail.symbol
                    }`
                  );
                }
              });
            }

            const timeUnitSeconds: number = Number(vault.rewardsDuration);
            const secondsInDay = 86400;
            const timeUnitDays = timeUnitSeconds / secondsInDay;
            const lockUpPeriod = `${timeUnitDays} ${
              timeUnitDays === 1 ? "Day" : "Days"
            }`;
            console.log(
              { timeUnitDays },
              new Date(timeUnitSeconds * 1000),
              vault.postGeneratedApr
            );

            const dailyRewards: string[] = [];
            dailyRewards.push(
              `${vault.dailyEmissionRewardA.toLocaleString()} ${
                vault.rewardTokenADetail.symbol
              }`
            );

            if (vault.isDualFactory) {
              dailyRewards.push(
                `${vault.dailyEmissionRewardB?.toLocaleString()} ${
                  vault.rewardTokenBDetail?.symbol
                }`
              );
            }

            return (
              <StyledRow
                key={vaultId}
                onClick={() => redirectToStakePage(vaultName)}
              >
                <StyledCell textalign="left">
                  <Flex gap={"8px"} align={"center"}>
                    <Flex
                      width={{ initial: "34px", lg: "62px" }}
                      justify={"center"}
                    >
                      {VAULTS_TOKEN_LOGOS[
                        vaultName as keyof typeof VAULTS_TOKEN_LOGOS
                      ].map((tokenLogo, idx) => (
                        <TokenImg
                          src={tokenLogo}
                          alt={"token logo"}
                          key={idx}
                        />
                      ))}
                    </Flex>
                    <Flex
                      px={{ initial: "8px", lg: "10px" }}
                      py={{ initial: "4px", sm: "12px" }}
                    >
                      <Text weight={"medium"} style={{ lineHeight: "17px" }}>
                        {isDesktop || !vaultName.includes("-") ? (
                          `${vaultName} Vault`
                        ) : (
                          <Flex direction={"column"}>
                            <span>{vaultName.split("-")[0]}</span>
                            <span>{vaultName.split("-")[1]} Vault</span>
                          </Flex>
                        )}
                      </Text>
                    </Flex>
                  </Flex>
                </StyledCell>

                <StyledCell textalign="right">
                  <Text>8.23%</Text>
                </StyledCell>

                {account && !isMobile && (
                  <StyledCell textalign="right">
                    <Flex direction={"column"}>
                      {userRewards &&
                        userRewards.map((reward, i) => (
                          <Text key={i} style={{ color: theme.color.green2 }}>
                            {reward}
                          </Text>
                        ))}
                    </Flex>
                  </StyledCell>
                )}

                <StyledCell textalign="right">
                  <Text>{totalSupply} OVL</Text>
                </StyledCell>

                {!isMobile && (
                  <StyledCell textalign="right">
                    <Text>{lockUpPeriod}</Text>
                  </StyledCell>
                )}

                {!isMobile && (
                  <StyledCell textalign="right">
                    <Flex width={"100%"} justify={"end"}>
                      <Flex direction={"column"} width={"140px"} align={"end"}>
                        {dailyRewards &&
                          dailyRewards.map((reward, i) => (
                            <Flex
                              key={i}
                              justify={"between"}
                              gap={"8px"}
                              width={"100%"}
                            >
                              <Text>{reward.split(" ")[0]}</Text>
                              <Text>{reward.split(" ")[1]}</Text>
                            </Flex>
                          ))}
                      </Flex>
                    </Flex>
                  </StyledCell>
                )}
              </StyledRow>
            );
          })}
      </tbody>
    </StyledTable>
  );
};

export default StakeTable;
