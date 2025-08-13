import { Flex, Avatar as RadixAvatar, Text } from "@radix-ui/themes";
import Loader from "../../../components/Loader";
import { shortenAddress } from "../../../utils/web3";
import { StyledCell, StyledRow } from "./leaderboard-table-styles";
import Avatar from "boring-avatars";
import { getRandomColors, getRandomName } from "../../../utils/boringAvatars";
import { DisplayUserData, ExtendedUserData } from "../types";
import MostTradedMarketLogo from "./MostTradedMarketLogo";

interface ENSProfile {
  data?: {
    username?: string;
    avatar?: string;
  };
}

interface LeaderboardRowsProps {
  ranks: DisplayUserData[] | undefined;
  ensProfiles: ENSProfile[];
  isMobile: boolean;
  getColumnValue: (user: ExtendedUserData) => React.ReactNode;
}

const LeaderboardRows = ({
  ranks,
  ensProfiles,
  isMobile,
  getColumnValue,
}: LeaderboardRowsProps) => {
  if (!ranks) {
    return (
      <tr>
        <td colSpan={4}>
          <Flex justify="center" height="100px" align="center">
            <Loader />
          </Flex>
        </td>
      </tr>
    );
  }

  return ranks.map((rank, index) => {
    const userProfile = ensProfiles[index]?.data;
    const username =
      userProfile?.username ?? shortenAddress(rank.walletAddress);
    const avatarUrl = userProfile?.avatar ?? null;

    return (
      <StyledRow key={rank.walletAddress}>
        <StyledCell textalign="center" width={isMobile ? "36px" : "60px"}>
          {rank.rank}
        </StyledCell>
        <StyledCell
          textalign="left"
          style={{ paddingLeft: isMobile ? "12px" : "20px" }}
        >
          <Flex align="center" gap="8px">
            {avatarUrl ? (
              <RadixAvatar
                radius="full"
                src={avatarUrl}
                fallback={`${username}'s avatar`}
              />
            ) : (
              <Avatar
                size={isMobile ? 28 : 36}
                variant="bauhaus"
                name={getRandomName()}
                colors={getRandomColors()}
              />
            )}
            <Text>{username}</Text>
          </Flex>
        </StyledCell>

        {!isMobile ? (
          <>
            <StyledCell textalign="right">{rank.totalProfitOVL}</StyledCell>
            <StyledCell textalign="right">{rank.totalProfitUSD}</StyledCell>
            <StyledCell textalign="right">{rank.totalPositions}</StyledCell>
            <StyledCell textalign="right">
              <MostTradedMarketLogo rank={rank} />
            </StyledCell>
            <StyledCell textalign="right">{rank.winRate}</StyledCell>
            <StyledCell textalign="right">{rank.totalVolumeOVL}</StyledCell>
            <StyledCell textalign="right">{rank.totalFeesOVL}</StyledCell>
          </>
        ) : (
          <StyledCell textalign="right">{getColumnValue(rank)}</StyledCell>
        )}
      </StyledRow>
    );
  });
};

export default LeaderboardRows;
