export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param data the data to return a link for
 * @param type the type of the data
 */
export const getExplorerLink = (data: string, type: ExplorerDataType): string => {
  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `https://berascan.com/tx/${data}`
    case ExplorerDataType.ADDRESS:
    case ExplorerDataType.TOKEN:
      return `https://berascan.com/address/${data}`
    case ExplorerDataType.BLOCK:
      return `https://berascan.com/block/${data}`
    default:
      return `https://berascan.com/`
  }
}
