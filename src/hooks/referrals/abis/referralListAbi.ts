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
  },
  {
  "inputs": [
    { "internalType": "address", "name": "to", "type": "address" },
    { "internalType": "uint256", "name": "amount", "type": "uint256" },
    { "internalType": "bytes32[]", "name": "proof", "type": "bytes32[]" }
  ],
  "name": "claimRewards",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
] as const;