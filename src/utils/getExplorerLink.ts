import {SUPPORTED_CHAINID} from '../constants/chains'

const ETHERSCAN_PREFIXES: {[chainId: number]: string} = {
  [SUPPORTED_CHAINID.MAINNET]: '',
  // [SUPPORTED_CHAINID.ROPSTEN]: 'ropsten.',
  [SUPPORTED_CHAINID.RINKEBY]: 'rinkeby.',
  [SUPPORTED_CHAINID.GÖRLI]: 'goerli.',
  // [SUPPORTED_CHAINID.KOVAN]: 'kovan.',
  // [SUPPORTED_CHAINID.OPTIMISM]: 'optimistic.',
  // [SUPPORTED_CHAINID.OPTIMISTIC_KOVAN]: 'kovan-optimistic.',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export const getExplorerLink = (chainId: number, data: string, type: ExplorerDataType): string => {
  if (chainId === SUPPORTED_CHAINID.ARBITRUM) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://arbiscan.io/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://arbiscan.io/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://arbiscan.io/block/${data}`
      default:
        return `https://arbiscan.io/`
    }
  }

  if (chainId === SUPPORTED_CHAINID.ARBITRUM_GÖRLI) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://goerli.arbiscan.io/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://goerli.arbiscan.io/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://goerli.arbiscan.io/block/${data}`
      default:
        return `https://goerli.arbiscan.io/`
    }
  }

  if (chainId === SUPPORTED_CHAINID.ARBITRUM_SEPOLIA) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://sepolia.arbiscan.io/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://sepolia.arbiscan.io/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://sepolia.arbiscan.io/block/${data}`
      default:
        return `https://sepolia.arbiscan.io/`
    }
  }

  if (chainId === SUPPORTED_CHAINID.IMOLA) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://explorer.testnet.imola.movementlabs.xyz/#/txn/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://explorer.testnet.imola.movementlabs.xyz/`
      case ExplorerDataType.BLOCK:
        return `https://explorer.testnet.imola.movementlabs.xyz/#/block/${data}`
      default:
        return `https://explorer.testnet.imola.movementlabs.xyz/`
    }
  }

  if (chainId === SUPPORTED_CHAINID.BARTIO) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://bartio.beratrail.io/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://bartio.beratrail.io/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://bartio.beratrail.io/block/${data}`
      default:
        return `https://bartio.beratrail.io/`
    }
  }

  if (chainId === SUPPORTED_CHAINID.BSC_TESTNET) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://testnet.bscscan.com/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://testnet.bscscan.com/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://testnet.bscscan.com/block/${data}`
      default:
        return `https://testnet.bscscan.com/`
    }
  }

  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] ?? ''}etherscan.io`

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`

    case ExplorerDataType.BLOCK:
      // if (chainId === SUPPORTED_CHAINID.OPTIMISM || chainId === SUPPORTED_CHAINID.OPTIMISTIC_KOVAN) {
      //   return `${prefix}/tx/${data}`
      // }
      return `${prefix}/block/${data}`

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`
    default:
      return `${prefix}`
  }
}
