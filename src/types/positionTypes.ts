import { Address } from "viem";

export interface OpenPositionData {
  marketName: string | Address | undefined;
  positionSide: string | undefined;
  parsedCreatedTimestamp: string | undefined;
  entryPrice: string | undefined;
  liquidatePrice: string | undefined;
  currentPrice: string | undefined;
  size: number | string | undefined;
  unrealizedPnL: string | number | undefined;
  parsedFunding: string | number | undefined;
  marketAddress: Address;
  positionId: number;
  priceCurrency: string;
}

export interface UnwindPositionData {
  marketName: string | undefined;
  positionSide: string | undefined;
  parsedCreatedTimestamp: string | undefined;
  parsedClosedTimestamp: string | undefined;
  entryPrice: string | undefined;
  exitPrice: string | undefined;
  size: string | undefined;
  pnl: string | number | undefined;
  unwindNumber: number;
  positionId: number;
}

export interface LiquidatedPositionData {
  marketName: string | undefined;
  position: string | undefined;
  created: string | undefined;
  liquidated: string | undefined;
  entryPrice: string | undefined;
  exitPrice: string | undefined;
  size: string | number | undefined;
}