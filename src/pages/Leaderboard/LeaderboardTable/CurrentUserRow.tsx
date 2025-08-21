import { Flex, Text } from "@radix-ui/themes";
import Loader from "../../../components/Loader";
import {
  BgRow,
  CurrentUserRankingRow,
  StyledCell,
} from "./current-user-row-styles";
import theme from "../../../theme";
import { shortenAddress } from "../../../utils/web3";
import { DisplayUserData, ExtendedUserData, Ranking } from "../types";
import useAccount from "../../../hooks/useAccount";
import UserDetails from "./UserDetails";
import { leaderboardColumns, RANKING_BY } from "./leaderboardConfig";

interface CurrentUserRowProps {
  formattedUserdata: DisplayUserData | undefined;
  isMobile: boolean;
  getColumnValue: (user: ExtendedUserData) => React.ReactNode;
}

const CurrentUserRow = ({
  formattedUserdata,
  isMobile,
  getColumnValue,
}: CurrentUserRowProps) => {
  const { address: account } = useAccount();

  if (!account || !formattedUserdata) return null;

  const displayRank =
    RANKING_BY === Ranking.ByVolume
      ? formattedUserdata?.rankByVolume
      : formattedUserdata?.rank;

  return (
    <tbody>
      <CurrentUserRankingRow>
        <StyledCell textalign="center" width={isMobile ? "36px" : "60px"}>
          {displayRank ?? <Loader />}
        </StyledCell>
        <StyledCell
          textalign="left"
          style={{ paddingLeft: isMobile ? "12px" : "20px" }}
        >
          <Flex justify="between" gap={"18px"}>
            <Flex align="center" gap="8px">
              <Text>{isMobile ? `Your rank` : `Your current rank`}</Text>
              <Text style={{ color: theme.color.grey8 }} size="1">
                {formattedUserdata?.username ?? shortenAddress(account)}
              </Text>
            </Flex>
            {isMobile && <UserDetails currentUser={formattedUserdata} />}
          </Flex>
        </StyledCell>

        {!isMobile ? (
          <>
            {leaderboardColumns.map((column) => (
              <StyledCell key={column.value} textalign="right">
                {column.render(formattedUserdata)}
              </StyledCell>
            ))}
          </>
        ) : (
          <StyledCell textalign="right">
            {getColumnValue(formattedUserdata)}
          </StyledCell>
        )}
      </CurrentUserRankingRow>
      <BgRow></BgRow>
    </tbody>
  );
};

export default CurrentUserRow;
