import { Flex, Text } from "@radix-ui/themes";
import Loader from "../../../components/Loader";
import {
  BgRow,
  CurrentUserRankingRow,
  StyledCell,
} from "./current-user-row-styles";
import theme from "../../../theme";
import { shortenAddress } from "../../../utils/web3";
import UserFullInfo from "./UserFullInfo";
import { DisplayUserData, ExtendedUserData } from "../types";
import useAccount from "../../../hooks/useAccount";
import MostTradedMarketLogo from "./MostTradedMarketLogo";

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

  return (
    <tbody>
      <CurrentUserRankingRow>
        <StyledCell textalign="center" width={isMobile ? "36px" : "60px"}>
          {formattedUserdata?.rank ?? <Loader />}
        </StyledCell>
        <StyledCell
          textalign="left"
          style={{ paddingLeft: isMobile ? "12px" : "20px" }}
        >
          <Flex justify="between">
            <Flex align="baseline" gap="8px">
              <Text>{isMobile ? `Your rank` : `Your current rank`}</Text>
              <Text style={{ color: theme.color.grey8 }} size="1">
                {formattedUserdata?.username ?? shortenAddress(account)}
              </Text>
            </Flex>
            {isMobile && <UserFullInfo currentUser={formattedUserdata} />}
          </Flex>
        </StyledCell>

        {!isMobile ? (
          <>
            <StyledCell textalign="right">
              {formattedUserdata?.totalProfitOVL ?? <Loader />}
            </StyledCell>
            <StyledCell textalign="right">
              {formattedUserdata?.totalProfitUSD ?? <Loader />}
            </StyledCell>
            <StyledCell textalign="right">
              {formattedUserdata?.totalPositions ?? <Loader />}
            </StyledCell>
            <StyledCell textalign="right">
              <MostTradedMarketLogo rank={formattedUserdata} />
            </StyledCell>
            <StyledCell textalign="right">
              {formattedUserdata?.winRate ?? <Loader />}
            </StyledCell>
            <StyledCell textalign="right">
              {formattedUserdata?.totalVolumeOVL ?? <Loader />}
            </StyledCell>
            <StyledCell textalign="right">
              {formattedUserdata?.totalFeesOVL ?? <Loader />}
            </StyledCell>
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
