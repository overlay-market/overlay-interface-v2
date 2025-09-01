import { Flex, Avatar as RadixAvatar, Text } from "@radix-ui/themes";
import Loader from "../../../components/Loader";
import { shortenAddress } from "../../../utils/web3";
import { StyledCell, StyledRow } from "./leaderboard-table-styles";
import Avatar from "boring-avatars";
import { getRandomColors, getRandomName } from "../../../utils/boringAvatars";
import { DisplayUserData, ExtendedUserData, Ranking } from "../types";
import { leaderboardColumns, RANKING_BY } from "./leaderboardConfig";

interface ENSProfile {
  username?: string;
  avatar?: string;
}

interface LeaderboardRowsProps {
  ranks: DisplayUserData[] | undefined;
  ensProfiles: Record<string, ENSProfile>;
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

  return ranks.map((rank) => {
    const userProfile = ensProfiles[rank.walletAddress];
    const username =
      userProfile?.username ?? shortenAddress(rank.walletAddress);
    const avatarUrl = userProfile?.avatar ?? null;
    const displayRank =
      RANKING_BY === Ranking.ByVolume ? rank.rankByVolume : rank.rank;

    return (
      <StyledRow key={rank.walletAddress}>
        <StyledCell textalign="center" width={isMobile ? "36px" : "60px"}>
          {displayRank}
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
            {leaderboardColumns.map((column) => (
              <StyledCell key={column.value} textalign="right">
                {column.render(rank)}
              </StyledCell>
            ))}
          </>
        ) : (
          <StyledCell textalign="right">{getColumnValue(rank)}</StyledCell>
        )}
      </StyledRow>
    );
  });
};

export default LeaderboardRows;
