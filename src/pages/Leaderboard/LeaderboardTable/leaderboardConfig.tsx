import { ColumnDef, Ranking } from "../types";
import { formatUnits } from "viem";
import { formatNumberWithCommas } from "../../../utils/formatPriceWithCurrency";
// import MostTradedMarketLogo from "./MostTradedMarketLogo";

export const RANKING_BY: Ranking = Ranking.ByVolume;

export const getLeaderboardColumns = (seasonId?: string): ColumnDef[] => {
  const columns: ColumnDef[] = [
    // {
    //   value: "profitOVL",
    //   label: "Profit OVL",
    //   render: (data) => data.totalProfitOVL,
    // },
    // {
    //   value: "profitUSD",
    //   label: "Profit USD",
    //   render: (data) => data.totalProfitUSD,
    // },
    // {
    //   value: "positions",
    //   label: "Number of Positions",
    //   render: (data) => data.totalPositions,
    // },
    // {
    //   value: "mostTradedMarket",
    //   label: "Most Traded Market",
    //   render: (data) => (
    //     <MostTradedMarketLogo
    //       marketId={data.marketId}
    //       marketName={data.marketName}
    //     />
    //   ),
    // },
    {
      value: "winRate",
      label: "Win Rate",
      render: (data) => data.winRate,
    },
  ];

  // Add Trading Days column only for funded-trader-competition
  if (seasonId === "funded-trader-competition") {
    columns.push({
      value: "tradingDays",
      label: "Trading Days",
      render: (data) => data.tradingDays ?? 0,
    });
  }

  // Add remaining columns
  columns.push(
    {
      value: "fees",
      label: "Fees USD",
      render: (data) => {
        const rawValue = typeof data.totalFeesUSD === 'string'
          ? parseFloat(data.totalFeesUSD)
          : data.totalFeesUSD;
        const value = Number(formatUnits(BigInt(Math.floor(rawValue)), 18));
        return `$${formatNumberWithCommas(value)}`;
      },
    },
    {
      value: "volume",
      label: "Volume USD",
      render: (data) => {
        const rawValue = typeof data.totalVolumeUSD === 'string'
          ? parseFloat(data.totalVolumeUSD)
          : data.totalVolumeUSD;
        const value = Number(formatUnits(BigInt(Math.floor(rawValue)), 18));
        if (value >= 1_000_000) {
          return `$${(value / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })} M`;
        }
        if (value >= 100) {
          return `$${Math.round(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
        }
        return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
      },
    }
  );

  return columns;
};

// Backwards compatibility: default export for all-time leaderboard
export const leaderboardColumns: ColumnDef[] = getLeaderboardColumns();
