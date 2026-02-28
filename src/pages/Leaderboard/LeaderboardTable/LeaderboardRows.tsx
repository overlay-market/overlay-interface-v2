import { Flex, Avatar as RadixAvatar, Text } from "@radix-ui/themes";
import Loader from "../../../components/Loader";
import { shortenAddress } from "../../../utils/web3";
import { StyledCell, StyledRow } from "./leaderboard-table-styles";
import Avatar from "boring-avatars";
import { getRandomColors, getRandomName } from "../../../utils/boringAvatars";
import { ColumnDef, DisplayUserData, ExtendedUserData } from "../types";

interface ENSProfile {
  username?: string;
  avatar?: string;
}

interface LeaderboardRowsProps {
  ranks: DisplayUserData[] | undefined;
  ensProfiles: Record<string, ENSProfile>;
  isMobile: boolean;
  getColumnValue: (user: ExtendedUserData) => React.ReactNode;
  columns: ColumnDef[];
}

const LeaderboardRows = ({
  ranks,
  ensProfiles,
  isMobile,
  getColumnValue,
  columns,
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
    const displayRank = rank.rank || rank.rankByVolume;

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
            {columns.map((column) => (
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
