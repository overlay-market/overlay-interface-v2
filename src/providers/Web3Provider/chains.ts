import * as allChains from 'viem/chains';
import type { Chain } from 'viem';

export const isMainnetChain = (chain: unknown): chain is Chain => {
  if (
    typeof chain !== 'object' ||
    chain === null ||
    !('id' in chain) ||
    !('rpcUrls' in chain)
  ) {
    return false;
  }

  const maybeChain = chain as Partial<Chain>;

  const isNotTestnet =
    maybeChain.testnet === false || maybeChain.testnet === undefined;

  const hasRpcUrls =
    typeof maybeChain.rpcUrls === 'object' &&
    maybeChain.rpcUrls !== null &&
    typeof maybeChain.rpcUrls.default === 'object' &&
    maybeChain.rpcUrls.default !== null &&
    Array.isArray(maybeChain.rpcUrls.default.http) &&
    maybeChain.rpcUrls.default.http.length > 0;

  return isNotTestnet && hasRpcUrls;
};

const untypedChains = Object.values(allChains);

const filtered = untypedChains.filter(isMainnetChain);

if (filtered.length === 0) {
  throw new Error("No valid mainnet chains found.");
}

export const mainnetChains = filtered.length > 0
  ? (filtered as unknown as readonly [Chain, ...Chain[]])
  : ([allChains.mainnet] as const);