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

export type AddressRowsType = {
  [address: string]: string[]
}