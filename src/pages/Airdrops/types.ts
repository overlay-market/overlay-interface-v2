export type AirdropAmount = {
  airdropID: string
  amount: string | null
}

export type AddressResults = {
  [address: string]: AirdropAmount[]
}

export type ResponseDataType = {
  addressResults: AddressResults
  invalidAddresses: string[]
}

export type AirdropsAmounts = {
  [airdropID: string]: string
}