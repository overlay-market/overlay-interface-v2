export const referralListAbi = [ 
  {
    "inputs": [
      { "internalType": "bytes", "name": "signature", "type": "bytes" }
    ],
    "name": "allowAffiliate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "affiliate", "type": "address" }
    ],
    "name": "AllowAffiliate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "KOL", "type": "address" }
    ],
    "name": "AllowKOL",
    "type": "event"
  }
] as const;