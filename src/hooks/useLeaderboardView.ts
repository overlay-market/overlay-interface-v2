import { useMemo, useState } from "react";
import useActiveMarkets from "./useActiveMarkets";
import { ColumnKey, DisplayUserData, ExtendedUserData } from "../pages/Leaderboard/types";
import { formatPriceWithCurrency } from "../utils/formatPriceWithCurrency";
import { leaderboardColumns } from "../pages/Leaderboard/LeaderboardTable/leaderboardConfig";

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

function formatToSigDigits(value: number, digits: number) {
  const str = Number(value).toPrecision(digits);
  return Number(str).toString();
}

export const useLeaderboardView = ({
  ranks,
  currentUser,  
}: Params): Return => {
  const { data: markets } = useActiveMarkets();

  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>(leaderboardColumns[leaderboardColumns.length - 1].value);

  const selectedLabel = useMemo(
    () => leaderboardColumns.find(opt => opt.value === selectedColumn)?.label ?? leaderboardColumns[leaderboardColumns.length - 1].label,
    [selectedColumn, leaderboardColumns]
  );

  const formattedUserdata: DisplayUserData | undefined = useMemo(() => {
    if (!currentUser) return undefined;
    const market = markets?.find(
      m => m.id === currentUser.mostTradedMarket.marketId
    );
    const formattedWinRate =
      Number(currentUser.winRate) > 0
        ?  `${Math.round(Number(currentUser.winRate) * 100)}%`
        : "N/A";
    
    const tranformedTotalProfitOVL = Number(currentUser.totalProfitOVL) / 1e18;

    const formattedTotalProfitOVL = formatToSigDigits(
      tranformedTotalProfitOVL,
      2
    );  

    const tranformedTotalProfitUSD = Number(currentUser.totalProfitUSD) / 1e18;

    const formattedTotalProfitUSD = formatPriceWithCurrency(
      tranformedTotalProfitUSD,
      "$"
    );  
    
    const transformedTotalVolumeOVL = Number(currentUser.totalVolumeOVL) / 1e18;
    const transformedTotalFeesOVL = Number(currentUser.totalFeesOVL) / 1e18;


    return {
      ...currentUser,
      winRate: formattedWinRate,
      totalProfitOVL: formattedTotalProfitOVL,
      totalProfitUSD: formattedTotalProfitUSD,
      totalVolumeOVL: formatToSigDigits(transformedTotalVolumeOVL, 2),
      totalFeesOVL: formatToSigDigits(transformedTotalFeesOVL, 2),
      marketId: market?.marketId || "",
      marketName: market?.marketName || "",
    };
  }, [currentUser, markets]);

  const formattedRanks: DisplayUserData[] | undefined = useMemo(() => {
  if (!ranks) return undefined;

  return ranks.map(rank => {
    const market = markets?.find(
      m => m.id === rank.mostTradedMarket.marketId
    );

    const formattedWinRate =
      Number(rank.winRate) > 0
        ?  `${Math.round(Number(rank.winRate) * 100)}%`
        : "N/A";
    
    const tranformedTotalProfitOVL = Number(rank.totalProfitOVL) / 1e18;

    const formattedTotalProfitOVL = formatToSigDigits(
      tranformedTotalProfitOVL,
      2
    );  

    const tranformedTotalProfitUSD = Number(rank.totalProfitUSD) / 1e18;

    const formattedTotalProfitUSD = formatPriceWithCurrency(
      tranformedTotalProfitUSD,
      "$"
    );  
    
    const transformedTotalVolumeOVL = Number(rank.totalVolumeOVL) / 1e18;
    const transformedTotalFeesOVL = Number(rank.totalFeesOVL) / 1e18;

    return {
      ...rank,
      winRate: formattedWinRate,
      totalProfitOVL: formattedTotalProfitOVL,
      totalProfitUSD: formattedTotalProfitUSD,
      totalVolumeOVL: formatToSigDigits(transformedTotalVolumeOVL, 2),
      totalFeesOVL: formatToSigDigits(transformedTotalFeesOVL, 2),
      marketId: market?.marketId || "",
      marketName: market?.marketName || "",
    };
  });
}, [ranks, markets]);

  return { selectedColumn, setSelectedColumn, selectedLabel,  formattedUserdata, formattedRanks };
};