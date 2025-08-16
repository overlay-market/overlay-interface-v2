import { ColumnDef, Ranking } from "../types";
// import MostTradedMarketLogo from "./MostTradedMarketLogo";

export const RANKING_BY: Ranking = Ranking.ByVolume;

export const leaderboardColumns: ColumnDef[] = [
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
  {
    value: "fees",
    label: "Fees OVL",
    render: (data) => data.totalFeesOVL,
  },
  {
    value: "volume",
    label: "Volume OVL",
    render: (data) => data.totalVolumeOVL,
  },
];
