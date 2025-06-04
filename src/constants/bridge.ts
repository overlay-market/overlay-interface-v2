export const SOLANA_DEVNET_EID = 10106; // LayerZero endpoint id for Solana devnet
export const BRIDGE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
export const OVL_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const BRIDGE_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "dstEid", type: "uint32" },
          { name: "to", type: "bytes32" },
          { name: "amountLD", type: "uint256" },
          { name: "minAmountLD", type: "uint256" },
          { name: "extraOptions", type: "bytes" },
          { name: "composeMsg", type: "bytes" },
          { name: "oftCmd", type: "bytes" }
        ],
        name: "_sendParam",
        type: "tuple"
      },
      {
        components: [
          { name: "nativeFee", type: "uint256" },
          { name: "zroFee", type: "uint256" },
          { name: "adapterParams", type: "bytes" }
        ],
        name: "_fee",
        type: "tuple"
      },
      { name: "_refundAddress", type: "address" }
    ],
    name: "send",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
] as const;
