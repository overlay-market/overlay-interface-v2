import { CHAINS } from "overlay-sdk";
import { Abi, Address } from "viem";
import { OverlayV1StateABI } from "./abis/OverlayV1State";
import { V1_PERIPHERY_ADDRESS } from "../constants/applications";

export type PositionData = {
  liquidatePrice: bigint;
  cost: bigint;
  tradingFee: bigint;
  marketMid: bigint;
};

export async function getOnchainPositionsData(
  core: any,
  chainId: CHAINS,
  positions: { marketId: Address; positionId: bigint; walletClient: Address }[]
): Promise<Record<string, PositionData | null>> {
  const OverlayV1StateABIFunctions = OverlayV1StateABI.filter(
    (abi) => abi.type === "function"
  );

  const liquidationPriceFn = OverlayV1StateABIFunctions.find(
    (abi) => abi.name === "liquidationPrice"
  );
  const midFn = OverlayV1StateABIFunctions.find((abi) => abi.name === "mid");
  const costFn = OverlayV1StateABIFunctions.find((abi) => abi.name === "cost");
  const tradingFeeFn = OverlayV1StateABIFunctions.find(
    (abi) => abi.name === "tradingFee"
  );

  const calls: {
    address: Address;
    abi: Abi;
    functionName: string;
    args: readonly unknown[];
  }[] = [];

  for (const { marketId, positionId, walletClient } of positions) {
    if (!marketId || !walletClient) continue;

    calls.push(
      {
        address: V1_PERIPHERY_ADDRESS[chainId],
        abi: [liquidationPriceFn!] as Abi,
        functionName: "liquidationPrice",
        args: [marketId, walletClient, positionId],
      },
      {
        address: V1_PERIPHERY_ADDRESS[chainId],
        abi: [midFn!] as Abi,
        functionName: "mid",
        args: [marketId],
      },
      {
        address: V1_PERIPHERY_ADDRESS[chainId],
        abi: [costFn!] as Abi,
        functionName: "cost",
        args: [marketId, walletClient, positionId],
      },
      {
        address: V1_PERIPHERY_ADDRESS[chainId],
        abi: [tradingFeeFn!] as Abi,
        functionName: "tradingFee",
        args: [marketId, walletClient, positionId],
      },
    );
  }

  const results = await core.rpcProvider.multicall({
    allowFailure: true,
    contracts: calls,
  });

  const data: Record<string, PositionData | null> = {};

  for (let i = 0; i < positions.length; i++) {
    const baseIndex = i * 6;
    const { marketId, positionId } = positions[i];

    const liqRes = results[baseIndex];
    const midRes = results[baseIndex + 1];
    const costRes = results[baseIndex + 2];
    const feeRes = results[baseIndex + 3];

    if (
      liqRes.status === "success" ||
      midRes.status === "success" ||
      costRes.status === "success" ||
      feeRes.status === "success" 
    ) {
      data[`${marketId}-${positionId}`] = {
        liquidatePrice:
          liqRes.status === "success" ? (liqRes.result as bigint) : 0n,
        marketMid:
          midRes.status === "success" ? (midRes.result as bigint) : 0n,
           cost: costRes.status === "success" ? (costRes.result as bigint) : 0n,
        tradingFee:
          feeRes.status === "success" ? (feeRes.result as bigint) : 0n, 
      } as PositionData;
    } else {
      data[`${marketId}-${positionId}`] = null;
    }
  }

  return data;
}