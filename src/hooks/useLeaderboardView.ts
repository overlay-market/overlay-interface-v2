import { useMemo, useState } from "react";
import useActiveMarkets from "./useActiveMarkets";
import { ColumnKey, DisplayUserData, ExtendedUserData } from "../pages/Leaderboard/types";

export interface ColumnDef {
  value: ColumnKey;
  label: string;
}

type Return = {
  selectedColumn: ColumnKey;
  setSelectedColumn: (k: ColumnKey) => void;
  selectedLabel: string;
  columnOptions: { value: ColumnKey; label: string }[];
  formattedUserdata?: DisplayUserData;
};

type Params = {
  ranks?: ExtendedUserData[];
  currentUserData?: ExtendedUserData;
};

export const useLeaderboardView = ({
  ranks,
  currentUserData,  
}: Params): Return => {
  const { data: markets } = useActiveMarkets();

  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>("profitOVL");

  const columnOptions: ColumnDef[] = [
    { value: "profitOVL", label: "Profit OVL" },
    { value: "profitUSD", label: "Profit USD" },
    { value: "positions", label: "Number of Positions" },
    { value: "mostTradedMarket", label: "Most Traded Market" },
    { value: "winRate", label: "Win Rate" },
    { value: "volume", label: "Volume OVL" },
    { value: "fees", label: "Fees OVL" },
  ];

  const selectedLabel = useMemo(
    () => columnOptions.find(opt => opt.value === selectedColumn)?.label ?? "",
    [selectedColumn]
  );

  const formattedUserdata: DisplayUserData | undefined = useMemo(() => {
    if (!currentUserData) return undefined;
    const market = markets?.find(
      m => m.id === currentUserData.mostTradedMarket.marketId
    );
    return {
      ...currentUserData,
      marketId: market?.marketId || "",
      marketName: market?.marketName || "",
    };
  }, [currentUserData, markets]);

  return { selectedColumn, setSelectedColumn, selectedLabel, columnOptions, formattedUserdata };
};