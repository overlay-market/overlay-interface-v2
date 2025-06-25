import { SUPPORTED_CHAINID } from "./chains";

export const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  // [SUPPORTED_CHAINID.MAINNET]: 'https://api.thegraph.com/subgraphs/name/bigboydiamonds/overlay-v1-subgraph',
  [SUPPORTED_CHAINID.MAINNET]: 'https://api.studio.thegraph.com/query/46086/overlay-subgraph-eth/v2.0.2',
  [SUPPORTED_CHAINID.ARBITRUM_SEPOLIA]:
  'https://gateway-arbitrum.network.thegraph.com/api/84ab887f7372fde61d4f1e228fa25964/subgraphs/id/59rgxaXFUQv5K6UXb1JJhS44uyPYn2EJFEZrZJLG5a4Y',
  [SUPPORTED_CHAINID.GÖRLI]: 'https://api.thegraph.com/subgraphs/name/bigboydiamonds/overlay-v1-subgraph-goerli',
  [SUPPORTED_CHAINID.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/bigboydiamonds/overlay-v1-subgraph-rinkeby',
  // [SUPPORTED_CHAINID.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/bigboydiamonds/overlay-v1-subgraph-arbitrum',
  // [SUPPORTED_CHAINID.ARBITRUM]: 'https://api.studio.thegraph.com/proxy/46086/overlay-subgraph-arbitrum/v2.0.12',
  [SUPPORTED_CHAINID.ARBITRUM]:
    'https://gateway-arbitrum.network.thegraph.com/api/9d0198304529988979fdf429caba9ed3/subgraphs/id/7RuVCeRzAHL5apu6SWHyUEVt3Ko2pUv2wMTiHQJaiUW9',
  [SUPPORTED_CHAINID.ARBITRUM_GÖRLI]: 'https://api.thegraph.com/subgraphs/name/bigboydiamonds/overlay-v1-subgraph-arb-goerli',
  [SUPPORTED_CHAINID.IMOLA]: 'https://subgraph.overlay.market/query/subgraphs/name/overlay/v1-subgraph',
  [SUPPORTED_CHAINID.BARTIO]: 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bartio/prod/gn',
  [SUPPORTED_CHAINID.BSC_TESTNET]: 'https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bnb-testnet/latest/gn',
}