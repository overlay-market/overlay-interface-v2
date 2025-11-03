import { SUPPORTED_CHAINID } from "./chains";

export const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/prod/gn',
  [SUPPORTED_CHAINID.BSC_TESTNET]: 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bnb-testnet/multi-factory/gn',
}