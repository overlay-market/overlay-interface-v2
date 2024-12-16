import {
  StyledCell,
  StyledHeader,
  StyledRow,
  Table,
} from "./leaderboard-table-styles";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { UserData } from "./types";
import { Flex, Text } from "@radix-ui/themes";
import { shortenAddress } from "../../utils/web3";
import { getRandomColors, getRandomName } from "../../utils/boringAvatars";
import Avatar from "boring-avatars";

type LeaderboardTableProps = {
  ranks?: UserData[];
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ ranks }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

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
          {!isMobile && (
            <StyledHeader textalign={"right"}>
              Points-Previous Week
            </StyledHeader>
          )}
          <StyledHeader textalign={"right"}>Total Points</StyledHeader>
        </tr>
      </thead>

      <tbody>
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
                    size={isMobile ? 28 : 36}
                    variant="bauhaus"
                    name={getRandomName()}
                    colors={getRandomColors()}
                  />
                  <Text>{shortenAddress(rank._id)}</Text>
                </Flex>
              </StyledCell>
              {!isMobile && (
                <StyledCell textalign="right">
                  {rank.previousWeekPoints}
                </StyledCell>
              )}
              <StyledCell textalign="right">{rank.totalPoints}</StyledCell>
            </StyledRow>
          ))}
      </tbody>
    </Table>
  );
};

export default LeaderboardTable;
