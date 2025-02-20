import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow, TokenImg } from "./stake-table-styles";
import theme from "../../../theme";
import { StakingPool } from "@steerprotocol/sdk";
import { useNavigate } from "react-router-dom";
import useAccount from "../../../hooks/useAccount";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useVaultsState } from "../../../state/vaults/hooks";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { useMemo } from "react";
import {
  getTokenLogo,
  getVaultNameByVaultAddress,
} from "../utils/currentVaultdata";
import { formatReward } from "../utils/formatReward";

type StakeRowProps = {
  vault: StakingPool;
};

const StakeRow: React.FC<StakeRowProps> = ({ vault }) => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { chainId } = useMultichainContext();
  const { vaultDetails } = useVaultsState();

  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const vaultAddress = vault.stakingPool.toLowerCase();
  const vaultName = getVaultNameByVaultAddress(chainId, vaultAddress);

  const formattedVaultName = useMemo(() => {
    if (isDesktop || !vaultName.includes("-")) {
      return `${vaultName} Vault`;
    }

    const [firstPart, secondPart] = vaultName.split("-");
    return (
      <Flex direction={"column"}>
        <span>{firstPart}</span>
        <span>{secondPart} Vault</span>
      </Flex>
    );
  }, [isDesktop, vaultName]);

  const tokenLogos = useMemo(() => {
    const logos = [
      getTokenLogo(vault.rewardTokenADetail),
      vault.isDualFactory && vault.rewardTokenBDetail
        ? getTokenLogo(vault.rewardTokenBDetail)
        : undefined,
    ].filter(Boolean);

    return logos;
  }, [vault.rewardTokenADetail, vault.rewardTokenBDetail]);

  const currentVaultDetails = vaultDetails?.find(
    (detail) => detail.vaultAddress.toLowerCase() === vaultAddress
  );

  const totalSupply = currentVaultDetails?.totalSupply.toLocaleString() ?? "";

  const userRewards = useMemo(() => {
    if (!currentVaultDetails?.userRewards) return [];

    const { userRewards } = currentVaultDetails;

    const rewards = [
      formatReward(userRewards.rewardA, vault.rewardTokenADetail),
      vault.isDualFactory && vault.rewardTokenBDetail
        ? formatReward(userRewards.rewardB, vault.rewardTokenBDetail)
        : null,
    ].filter(Boolean);

    return rewards;
  }, [currentVaultDetails, vault]);

  const lockUpPeriod = useMemo(() => {
    const timeUnitSeconds = Number(vault.rewardsDuration);
    const secondsInDay = 86400;
    const timeUnitDays = Math.trunc(timeUnitSeconds / secondsInDay);

    return `${timeUnitDays} ${timeUnitDays === 1 ? "Day" : "Days"}`;
  }, [vault.rewardsDuration]);

  const dailyRewards = useMemo(() => {
    const rewards = [
      formatReward(vault.dailyEmissionRewardA, vault.rewardTokenADetail),
      vault.isDualFactory && vault.rewardTokenBDetail
        ? formatReward(vault.dailyEmissionRewardB, vault.rewardTokenBDetail)
        : null,
    ]
      .filter(
        (reward): reward is string => reward !== null && reward !== undefined
      )
      .map((reward) => {
        const [amount, symbol] = reward.split(" ");
        return { amount, symbol };
      });

    return rewards;
  }, [vault]);

  const redirectToStakePage = (vaultId: string) => {
    navigate(`/earn/${encodeURIComponent(vaultId)}`);
  };

  return (
    <StyledRow onClick={() => redirectToStakePage(vaultName)}>
      <StyledCell textalign="left">
        <Flex gap={"8px"} align={"center"}>
          <Flex width={{ initial: "34px", lg: "62px" }} justify={"center"}>
            {tokenLogos.map((tokenLogo, idx) => (
              <TokenImg src={tokenLogo} alt={"token logo"} key={idx} />
            ))}
          </Flex>
          <Flex
            px={{ initial: "8px", lg: "10px" }}
            py={{ initial: "4px", sm: "12px" }}
          >
            <Text weight={"medium"} style={{ lineHeight: "17px" }}>
              {formattedVaultName}
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

      {/* {!isMobile && (
        <StyledCell textalign="right">
          <Text>{lockUpPeriod}</Text>
        </StyledCell>
      )} */}

      {!isMobile && (
        <StyledCell textalign="right">
          <Flex width={"100%"} justify={"end"}>
            <Flex direction={"column"} width={"140px"} align={"end"}>
              {dailyRewards &&
                dailyRewards.map((reward, i) => (
                  <Flex key={i} justify={"between"} width={"100%"}>
                    <Text>{reward.amount}</Text>
                    <Text>{reward.symbol}</Text>
                  </Flex>
                ))}
            </Flex>
          </Flex>
        </StyledCell>
      )}
    </StyledRow>
  );
};

export default StakeRow;
