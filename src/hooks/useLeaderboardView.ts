import { useMemo, useState } from "react";
import useActiveMarkets from "./useActiveMarkets";
import { ColumnKey, DisplayUserData, ExtendedUserData } from "../pages/Leaderboard/types";
import { formatPriceWithCurrency } from "../utils/formatPriceWithCurrency";
import { leaderboardColumns } from "../pages/Leaderboard/LeaderboardTable/leaderboardConfig";
import { MarketDataParsed } from "../types/marketTypes";

type Return = {
  selectedColumn: ColumnKey;
  setSelectedColumn: (k: ColumnKey) => void;
  selectedLabel: string;
  formattedUserdata?: DisplayUserData;
  formattedRanks?: DisplayUserData[];
};

type Params = {
  ranks?: ExtendedUserData[];
  currentUser?: ExtendedUserData;
};

const formatToSigDigits = (value: number, digits: number = 2) => {
  if (value === 0) {
    return "0";
  }

  if (Math.abs(value) < 1) {    
    return Number(value.toPrecision(digits)).toString();
  } else if (Math.abs(value) >= 100) {   
    return value.toFixed(0); 
  } 
  else {   
    return value.toFixed(digits);
  }
}

const formatUserData = (user: ExtendedUserData, markets: MarketDataParsed[] | undefined): DisplayUserData => {
  const market = markets?.find(m => m.id === user.mostTradedMarket.marketId);

  const formattedWinRate = `${Math.round(Number(user.winRate) * 100)}%` || "N/A";

  const formatBigNumber = (value: number | string, currency: string = "") => {
    const transformedValue = Number(value) / 1e18;
    const roundedValue = formatToSigDigits(transformedValue, 2);
    return formatPriceWithCurrency(roundedValue, currency);
  };

  return {
    ...user,
    winRate: formattedWinRate,
    totalProfitOVL: formatBigNumber(user.totalProfitOVL),
    totalProfitUSD: formatBigNumber(user.totalProfitUSD, '$'),
    totalVolumeOVL: formatBigNumber(user.totalVolumeOVL),
    totalFeesOVL: formatBigNumber(user.totalFeesOVL),
    marketId: market?.marketId || "",
    marketName: market?.marketName || "",
  };
};


export const useLeaderboardView = ({
  ranks,
  currentUser,  
}: Params): Return => {
  const { data: markets } = useActiveMarkets();

  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>(leaderboardColumns[leaderboardColumns.length - 1].value);

  const selectedLabel = useMemo(
    () => leaderboardColumns.find(opt => opt.value === selectedColumn)?.label ?? leaderboardColumns[leaderboardColumns.length - 1].label,
    [selectedColumn]
  );

  const formattedUserdata = useMemo(
    () => (currentUser ? formatUserData(currentUser, markets) : undefined),
    [currentUser, markets]
  );

  const formattedRanks = useMemo(
    () => (ranks ? ranks.map(rank => formatUserData(rank, markets)) : undefined),
    [ranks, markets]
  );

  return { selectedColumn, setSelectedColumn, selectedLabel,  formattedUserdata, formattedRanks };
};