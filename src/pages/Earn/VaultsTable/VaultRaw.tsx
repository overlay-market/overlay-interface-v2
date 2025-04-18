import { Flex, HoverCard, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow, TokenImg } from "./vaults-table-styles";
import theme from "../../../theme";
import { useNavigate } from "react-router-dom";
import useAccount from "../../../hooks/useAccount";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useEffect, useMemo, useState } from "react";
import { useCurrentVaultDetails } from "../hooks/useCurrentVaultData";
import { StaticVaultData } from "../../../types/vaultTypes";
import { TOKEN_LOGOS } from "../../../constants/vaults";
import { getUserRewards } from "../utils/getUserRewards";

type VaultRowProps = {
  vault: StaticVaultData;
};

const VaultRow: React.FC<VaultRowProps> = ({ vault }) => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const [userRewards, setUserRewards] = useState<string[]>([]);

  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const currentVaultDetails = useCurrentVaultDetails(
    vault.vaultAddress.poolVault
  );

  const formattedVaultName = useMemo(() => {
    if (isDesktop || !vault.vaultName.includes("-")) {
      return `${vault.vaultName}`;
    }

    const [firstPart, secondPart] = vault.vaultName.split("-");
    return (
      <Flex direction={"column"}>
        <span>{firstPart}</span>
        <span>{secondPart}</span>
      </Flex>
    );
  }, [isDesktop, vault.vaultName]);

  const tokenLogos = useMemo(() => {
    if (!vault.rewardTokens || !vault.rewardTokens.length) return [];

    const logos = vault.rewardTokens
      .map((token) => TOKEN_LOGOS[token.rewardTokenName])
      .filter(Boolean);

    return logos;
  }, [vault]);

  const apr = useMemo(() => {
    return currentVaultDetails
      ? `${Number(currentVaultDetails.totalApr).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`
      : null;
  }, [currentVaultDetails]);

  const poolApr = useMemo(() => {
    return currentVaultDetails
      ? `${Number(currentVaultDetails.poolApr).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`
      : null;
  }, [currentVaultDetails]);

  const rewardsApr = useMemo(() => {
    return currentVaultDetails
      ? `${Number(currentVaultDetails.rewardsApr).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`
      : null;
  }, [currentVaultDetails]);

  const tvl = useMemo(() => {
    return currentVaultDetails
      ? `$${Number(currentVaultDetails.tvl).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`
      : null;
  }, [currentVaultDetails]);

  useEffect(() => {
    const fetchRewards = async () => {
      const rewards = await getUserRewards(vault);
      setUserRewards(rewards);
    };

    if (account && vault) {
      fetchRewards();
    }
  }, [account, vault]);

  const rewards = useMemo(() => {
    const rewards = vault.rewardTokens.map((token) => token.rewardTokenName);

    if (rewards.length === 1) {
      return rewards[0];
    } else {
      if (isDesktop) {
        return `${rewards.join(" / ")}`;
      } else {
        return (
          <Flex direction={"column"}>
            <span>{rewards[0]}</span>
            <span>{rewards[1]}</span>
          </Flex>
        );
      }
    }
  }, [isDesktop, vault]);

  const redirectToStakePage = (vaultId: string) => {
    navigate(`/earn/${encodeURIComponent(vaultId)}`);
  };

  return (
    <StyledRow onClick={() => redirectToStakePage(vault.vaultName)}>
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
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Text>{apr}</Text>
          </HoverCard.Trigger>
          <HoverCard.Content
            maxWidth="300px"
            style={{ background: theme.color.background }}
          >
            <Flex gap="4" direction={"column"}>
              <Flex gap="4" justify={"between"}>
                <Text>Total APR</Text>
                <Text>{apr}</Text>
              </Flex>

              <Flex gap="1" direction={"column"}>
                <Flex gap="4" justify={"between"}>
                  <Text>Pool APR</Text>
                  <Text>{poolApr}</Text>
                </Flex>

                <Flex gap="4" justify={"between"}>
                  <Text>Rewards APR</Text>
                  <Text>{rewardsApr}</Text>
                </Flex>
              </Flex>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>
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
        <Text>{tvl}</Text>
      </StyledCell>

      {!isMobile && (
        <StyledCell textalign="right">
          <Flex width={"100%"} justify={"end"}>
            {rewards}
          </Flex>
        </StyledCell>
      )}
    </StyledRow>
  );
};

export default VaultRow;
