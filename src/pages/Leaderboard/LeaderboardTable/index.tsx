import { StyledHeader, Table } from "./leaderboard-table-styles";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { ExtendedUserData } from "../types";
import { useResolveENSProfilesBatched } from "../../../hooks/useENSProfile";
import { useLeaderboardView } from "../../../hooks/useLeaderboardView";
import ColumnSelector from "./ColumnSelector";
import CurrentUserRow from "./CurrentUserRow";
import LeaderboardRows from "./LeaderboardRows";
import * as Tooltip from "@radix-ui/react-tooltip";
import theme from "../../../theme";
import { getLeaderboardColumns } from "./leaderboardConfig";
import { useMemo } from "react";

type LeaderboardTableProps = {
  ranks?: ExtendedUserData[];
  currentUserData?: ExtendedUserData;
  seasonId?: string;
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  ranks,
  currentUserData,
  seasonId,
}) => {
  const isMobile = useMediaQuery("(max-width: 1150px)");
  const ensProfiles = useResolveENSProfilesBatched(ranks);

  const leaderboardColumns = useMemo(
    () => getLeaderboardColumns(seasonId),
    [seasonId]
  );

  const {
    selectedColumn,
    setSelectedColumn,
    selectedLabel,
    formattedUserdata,
    formattedRanks,
  } = useLeaderboardView({ ranks, currentUser: currentUserData, columns: leaderboardColumns });

  const selectedColumnDef = leaderboardColumns.find(
    (col) => col.value === selectedColumn
  );

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
            leaderboardColumns.map((col) => (
              <StyledHeader key={col.value} textalign="right">
                {col.value === "positions" ? (
                  <Tooltip.Provider delayDuration={100}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span>{col.label}</span>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        style={{
                          color: theme.color.green1,
                          padding: "4px 8px",
                          fontSize: "12px",
                        }}
                      >
                        Total number of closed positions
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                ) : (
                  col.label
                )}
              </StyledHeader>
            ))
          ) : (
            <StyledHeader textalign="right">
              <ColumnSelector
                selectedLabel={selectedLabel}
                setSelectedColumn={setSelectedColumn}
                columns={leaderboardColumns}
              />
            </StyledHeader>
          )}
        </tr>
      </thead>

      <CurrentUserRow
        formattedUserdata={formattedUserdata}
        isMobile={isMobile}
        getColumnValue={(data) => selectedColumnDef?.render(data)}
        columns={leaderboardColumns}
      />

      <tbody>
        <LeaderboardRows
          ranks={formattedRanks}
          ensProfiles={ensProfiles}
          isMobile={isMobile}
          getColumnValue={(data) => selectedColumnDef?.render(data)}
          columns={leaderboardColumns}
        />
      </tbody>
    </Table>
  );
};

export default LeaderboardTable;
