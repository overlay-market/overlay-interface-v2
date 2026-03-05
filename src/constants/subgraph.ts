import { SUPPORTED_CHAINID } from "./chains";

export const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SUPPORTED_CHAINID.BSC_MAINNET]: 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/9-lbsc-new-gamba/gn',
  [SUPPORTED_CHAINID.BSC_TESTNET]: 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bnb-testnet/6-stable-pnl/gn',
}

export const SUBGRAPH_WITH_REFERRAL_URL = 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/9-lbsc-new-gamba/gn'
