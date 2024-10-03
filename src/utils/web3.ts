import { isAddress } from 'viem'

// returns the checksummed address if the address is valid, otherwise returns false
export function parseAddress(value: string): string | false {
  try {
    return isAddress(value) ?  value.toLowerCase() : false
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = parseAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}