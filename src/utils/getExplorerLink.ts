const BSCSCAN_URL = 'https://bscscan.com'
const LAYERZERO_URL = 'https://layerzeroscan.com'

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
  BRIDGE = 'bridge',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export const getExplorerLink = (_chainId: number, data: string, type: ExplorerDataType): string => {
  // Special case for Bridge transactions
  if (type === ExplorerDataType.BRIDGE) {
    return `${LAYERZERO_URL}/tx/${data}`
  }

  // Handle all other cases
  if (!data) {
    return BSCSCAN_URL
  }

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${BSCSCAN_URL}/tx/${data}`
    case ExplorerDataType.TOKEN:
    case ExplorerDataType.ADDRESS:
      return `${BSCSCAN_URL}/address/${data}`
    case ExplorerDataType.BLOCK:
      return `${BSCSCAN_URL}/block/${data}`
    default:
      return BSCSCAN_URL
  }
}
