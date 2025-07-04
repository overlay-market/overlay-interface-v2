export const volatilityCheckABI = [
  {
    "inputs":[
      {
        "internalType":"address",
        "name":"vault",
        "type":"address"
      }
    ],
    "name":"currentVolatility",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"volatility",
        "type":"uint256"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  }
] as const;