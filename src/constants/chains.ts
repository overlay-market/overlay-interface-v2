import { Chain, defineChain } from 'viem'

export enum SUPPORTED_CHAINID {
  MAINNET = 1, //at launch
  RINKEBY = 4, //pre-launch only
  GÖRLI = 5, //pre-launch only
  ARBITRUM = 42161,
  ARBITRUM_GÖRLI = 421613,
  ARBITRUM_SEPOLIA = 421614,
  IMOLA = 30732,
  BARTIO = 80084,
}

export const DEFAULT_NET = SUPPORTED_CHAINID[421614]
export const DEFAULT_CHAINID: number | Chain = SUPPORTED_CHAINID.ARBITRUM_SEPOLIA

export const WORKING_CHAINS = [
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.ARBITRUM_SEPOLIA], 
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.IMOLA], 
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.BARTIO],
]
 
export const imola = defineChain({
  id: 30732,
  name: 'Movement',
  nativeCurrency: {
    decimals: 18,
    name: 'MOVE',
    symbol: 'MOVE',
  },
  rpcUrls: {
    default: {
      http: ['https://overlay-rpc.devnet.imola.movementnetwork.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.devnet.imola.movementlabs.xyz/#/?network=testnet' },
  }
})