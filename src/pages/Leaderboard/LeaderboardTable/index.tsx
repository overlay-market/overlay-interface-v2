import { StyledHeader, Table } from "./leaderboard-table-styles";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { ExtendedUserData } from "../types";
import Loader from "../../../components/Loader";
import { useResolveENSProfiles } from "../../../hooks/useENSProfile";
import { useLeaderboardView } from "../../../hooks/useLeaderboardView";
import ColumnSelector from "./ColumnSelector";
import CurrentUserRow from "./CurrentUserRow";
import LeaderboardRows from "./LeaderboardRows";
import MostTradedMarketLogo from "./MostTradedMarketLogo";

type LeaderboardTableProps = {
  ranks?: ExtendedUserData[];
  currentUserData?: ExtendedUserData;
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  ranks,
  currentUserData,
}) => {
  const isMobile = useMediaQuery("(max-width: 1150px)");
  const ensProfiles = useResolveENSProfiles(ranks);

  const {
    selectedColumn,
    setSelectedColumn,
    selectedLabel,
    columnOptions,
    formattedUserdata,
    formattedRanks,
  } = useLeaderboardView({ ranks, currentUser: currentUserData });

  const getColumnValue = (data: ExtendedUserData) => {
    switch (selectedColumn) {
      case "profitOVL":
        return data.totalProfitOVL ?? <Loader />;
      case "profitUSD":
        return data.totalProfitUSD ?? <Loader />;
      case "positions":
        return data.totalPositions ?? <Loader />;
      case "winRate":
        return data.winRate ?? <Loader />;
      case "volume":
        return data.totalVolumeOVL ?? <Loader />;
      case "fees":
        return data.totalFeesOVL ?? <Loader />;
      case "mostTradedMarket":
        return <MostTradedMarketLogo rank={data} />;
      default:
        return data.totalProfitOVL ?? <Loader />;
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <StyledHeader textalign="center">Rank</StyledHeader>
          <StyledHeader
            textalign="left"
            style={{ paddingLeft: isMobile ? "12px" : "20px" }}
          >
            Leaderboard Rankings
          </StyledHeader>
          {!isMobile ? (
            columnOptions.map((col) => (
              <StyledHeader key={col.value} textalign="right">
                {col.label}
              </StyledHeader>
            ))
          ) : (
            <StyledHeader textalign="right">
              <ColumnSelector
                selectedLabel={selectedLabel}
                columnOptions={columnOptions}
                setSelectedColumn={setSelectedColumn}
              />
            </StyledHeader>
          )}
        </tr>
      </thead>

      <CurrentUserRow
        formattedUserdata={formattedUserdata}
        isMobile={isMobile}
        getColumnValue={getColumnValue}
      />

      <tbody>
        <LeaderboardRows
          ranks={formattedRanks}
          ensProfiles={ensProfiles}
          isMobile={isMobile}
          getColumnValue={getColumnValue}
        />
      </tbody>
    </Table>
  );
};

export default LeaderboardTable;
