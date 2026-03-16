import axios from "axios";
import { SUPPORTED_CHAINID } from "../constants/chains";
import { CHAINS } from "overlay-sdk";

const MARKETS_API_URL = "https://api.overlay.market/data/api/markets";

// Module-level cache
let cachedMapping: Record<string, string> | null = null;
let cachedChainId: number | undefined;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchMarketAddressMapping(
  chainId: number | undefined
): Promise<Record<string, string>> {
  const now = Date.now();
  if (
    cachedMapping &&
    cachedChainId === chainId &&
    now - cacheTimestamp < CACHE_TTL
  ) {
    return cachedMapping;
  }

  const response = await axios.get(MARKETS_API_URL);

  const activeChainId =
    Number(chainId) === SUPPORTED_CHAINID.BSC_TESTNET
      ? CHAINS.BscTestnet
      : CHAINS.BscMainnet;

  const marketsForChain = Array.isArray(response.data?.[activeChainId])
    ? response.data[activeChainId]
    : [];

  const mapping: Record<string, string> = {};
  marketsForChain.forEach(
    (item: {
      marketId: string;
      chains: {
        chainId?: number;
        deploymentAddress: string;
        deprecated?: boolean;
      }[];
    }) => {
      if (!Array.isArray(item.chains) || item.chains.length === 0) return;
      const chainDeployment =
        item.chains.find(
          (c) => c.chainId === activeChainId && !c.deprecated
        ) ||
        item.chains.find((c) => c.chainId === activeChainId) ||
        item.chains.find((c) => !c.deprecated) ||
        item.chains[0];
      if (chainDeployment?.deploymentAddress) {
        mapping[item.marketId] =
          chainDeployment.deploymentAddress.toLowerCase();
      }
    }
  );

  cachedMapping = mapping;
  cachedChainId = chainId;
  cacheTimestamp = now;

  return mapping;
}
