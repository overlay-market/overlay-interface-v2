import { Reward } from "@steerprotocol/sdk";

export const formatReward = (reward: number | undefined, tokenDetail: Reward) => {
  if (reward === undefined) return "";
  return `${reward.toLocaleString()} ${tokenDetail.symbol}`;
};