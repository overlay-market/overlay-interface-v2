import {
  BgRow,
  CurrentUserRankingRow,
  StyledCell,
  StyledHeader,
  StyledRow,
  Table,
} from "./leaderboard-table-styles";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ExtendedUserData } from "./types";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { shortenAddress } from "../../utils/web3";
import { getRandomColors, getRandomName } from "../../utils/boringAvatars";
import BoringAvatar from "boring-avatars";
import theme from "../../theme";
import Loader from "../../components/Loader";
import useAccount from "../../hooks/useAccount";

type LeaderboardTableProps = {
  ranks?: ExtendedUserData[];
  currentUserData?: ExtendedUserData;
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  ranks,
  currentUserData,
}) => {
  const { address: account } = useAccount();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMultipleSessions = false;

  return (
    <Table>
      <thead>
        <tr>
          <StyledHeader textalign={"center"}>Rank</StyledHeader>
          <StyledHeader
            textalign={"left"}
            style={{ paddingLeft: isMobile ? "12px" : "20px" }}
          >
            Leaderboard Rankings
          </StyledHeader>
          {!isMobile && isMultipleSessions && (
            <StyledHeader textalign={"right"}>
              Points-Previous Week
            </StyledHeader>
          )}
          <StyledHeader textalign={"right"}>Total PnL</StyledHeader>
        </tr>
      </thead>

      {account && (
        <tbody>
          <CurrentUserRankingRow>
            <StyledCell
              textalign="center"
              weight={"400"}
              width={isMobile ? "36px" : "60px"}
            >
              {currentUserData?.rank ?? "N/A"}
            </StyledCell>
            <StyledCell
              textalign="left"
              style={{ paddingLeft: isMobile ? "12px" : "20px" }}
            >
              <Flex align={"baseline"} gap={"8px"}>
                <Text>{isMobile ? `Your rank` : `Your current rank`}</Text>
                <Text
                  style={{ color: theme.color.grey8 }}
                  weight={"regular"}
                  size={"1"}
                >
                  {currentUserData?.username ?? shortenAddress(account)}
                </Text>
              </Flex>
            </StyledCell>
            {!isMobile && isMultipleSessions && (
              <StyledCell textalign="right">
                {currentUserData?.previousWeekPoints ?? "0"}
              </StyledCell>
            )}
            <StyledCell textalign="right">
              {currentUserData?.totalPoints
                ? (+currentUserData?.totalPoints).toFixed(2) + "%"
                : "0"}
            </StyledCell>
          </CurrentUserRankingRow>
          <BgRow></BgRow>
        </tbody>
      )}

      <tbody>
        {!ranks && (
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
        {ranks &&
          ranks.map((rank, index) => (
            <StyledRow key={rank._id}>
              <StyledCell
                textalign="center"
                weight={"400"}
                width={isMobile ? "36px" : "60px"}
              >
                {index + 1}
              </StyledCell>
              <StyledCell
                textalign="left"
                style={{ paddingLeft: isMobile ? "12px" : "20px" }}
              >
                <Flex align={"center"} gap={"8px"}>
                  <Avatar
                    src={rank.avatar}
                    radius="full"
                    fallback={
                      <BoringAvatar
                        size={isMobile ? 28 : 36}
                        variant="bauhaus"
                        name={getRandomName()}
                        colors={getRandomColors()}
                      />
                    }
                  />
                  <Text>{rank.username ?? shortenAddress(rank._id)}</Text>
                </Flex>
              </StyledCell>
              {!isMobile && isMultipleSessions && (
                <StyledCell textalign="right">
                  {rank.previousWeekPoints}
                </StyledCell>
              )}
              <StyledCell textalign="right">
                {rank.totalPoints.toFixed(2) + "%"}
              </StyledCell>
            </StyledRow>
          ))}
      </tbody>
    </Table>
  );
};

export default LeaderboardTable;
