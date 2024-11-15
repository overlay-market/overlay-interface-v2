import { http } from 'wagmi'
import {createConfig} from '@privy-io/wagmi'
import { arbitrumSepolia, berachainTestnetbArtio } from 'wagmi/chains'
import { imola } from '../../constants/chains'

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia, berachainTestnetbArtio, imola],
  transports: {
    [arbitrumSepolia.id]: http(),
    [berachainTestnetbArtio.id]: http(),
    [imola.id]: http(),
  },
})