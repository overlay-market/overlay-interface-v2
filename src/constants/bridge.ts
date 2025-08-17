export const SOLANA_MAINNET_EID = 30168; // LayerZero endpoint id for Solana Mainnet
export const BSC_MAINNET_EID = 30102; // LayerZero endpoint id for BSC mainnet
export const BRIDGE_CONTRACT_ADDRESS = "0x551D0BCd03aA13609a6982Cf8554f9ACa04C9464"; // BSC mainnet OvlOFTAdapter
export const OVL_TOKEN_ADDRESS = "0x1F34c87ded863Fe3A3Cd76FAc8adA9608137C8c3";

// Solana mainnet deployment addresses
export const SOLANA_OFT_PROGRAM_ID = "HLzTG3sKDx1a8E4gWNn7x6fdxBG99pnN7ssxYm3APA8o"; // LayerZero OFT program
export const SOLANA_OVL_MINT = "DXoC7CCQquzYaut2wtMELDGBTqNLAk5VsMawxa5CS2nA"; // OVL token mint
export const SOLANA_MINT_AUTHORITY = "FPbEsKkuWNVjR33J7eyJsKCYNtp2dU6ktTE9XziULM6Z"; // Mint authority
export const SOLANA_ESCROW = "8q4t9AwGzKYkdVSQ2U8KayyJnarsoJ8D8WHsGfhenS3a"; // Escrow account
export const SOLANA_OFT_STORE = "Gz1ACtKBXxkee46gEteEowLDjcUEtC5TAZV9GSodJMag"; // OFT store account

// Standard Solana program addresses
export const SOLANA_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

// LayerZero OFT configuration
export const OFT_DECIMALS = 18; // EVM token decimals
export const SOLANA_TOKEN_DECIMALS = 9; // SPL token decimals

// Connection endpoints - using alternative RPC providers
export const SOLANA_MAINNET_RPC = "https://solana-mainnet.g.alchemy.com/v2/demo";
export const SOLANA_MAINNET_RPC_FALLBACK = "https://mainnet.helius-rpc.com/?api-key=demo";
export const SOLANA_DEVNET_RPC = "https://api.devnet.solana.com";

// For development - use devnet which has fewer rate limits
export const USE_DEVNET = false;
export const CURRENT_SOLANA_RPC = USE_DEVNET ? SOLANA_DEVNET_RPC : SOLANA_MAINNET_RPC;

export const BRIDGE_ABI = [
        {
            "type": "function",
            "name": "SEND",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint16",
                    "internalType": "uint16"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "SEND_AND_CALL",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint16",
                    "internalType": "uint16"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "allowInitializePath",
            "inputs": [
                {
                    "name": "origin",
                    "type": "tuple",
                    "internalType": "struct Origin",
                    "components": [
                        {
                            "name": "srcEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "sender",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "nonce",
                            "type": "uint64",
                            "internalType": "uint64"
                        }
                    ]
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "approvalRequired",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "pure"
        },
        {
            "type": "function",
            "name": "combineOptions",
            "inputs": [
                {
                    "name": "_eid",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "_msgType",
                    "type": "uint16",
                    "internalType": "uint16"
                },
                {
                    "name": "_extraOptions",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "decimalConversionRate",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "endpoint",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract ILayerZeroEndpointV2"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "enforcedOptions",
            "inputs": [
                {
                    "name": "eid",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "msgType",
                    "type": "uint16",
                    "internalType": "uint16"
                }
            ],
            "outputs": [
                {
                    "name": "enforcedOption",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "isComposeMsgSender",
            "inputs": [
                {
                    "name": "",
                    "type": "tuple",
                    "internalType": "struct Origin",
                    "components": [
                        {
                            "name": "srcEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "sender",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "nonce",
                            "type": "uint64",
                            "internalType": "uint64"
                        }
                    ]
                },
                {
                    "name": "",
                    "type": "bytes",
                    "internalType": "bytes"
                },
                {
                    "name": "_sender",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "isPeer",
            "inputs": [
                {
                    "name": "_eid",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "_peer",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "lzReceive",
            "inputs": [
                {
                    "name": "_origin",
                    "type": "tuple",
                    "internalType": "struct Origin",
                    "components": [
                        {
                            "name": "srcEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "sender",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "nonce",
                            "type": "uint64",
                            "internalType": "uint64"
                        }
                    ]
                },
                {
                    "name": "_guid",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "_message",
                    "type": "bytes",
                    "internalType": "bytes"
                },
                {
                    "name": "_executor",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_extraData",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "lzReceiveAndRevert",
            "inputs": [
                {
                    "name": "_packets",
                    "type": "tuple[]",
                    "internalType": "struct InboundPacket[]",
                    "components": [
                        {
                            "name": "origin",
                            "type": "tuple",
                            "internalType": "struct Origin",
                            "components": [
                                {
                                    "name": "srcEid",
                                    "type": "uint32",
                                    "internalType": "uint32"
                                },
                                {
                                    "name": "sender",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "nonce",
                                    "type": "uint64",
                                    "internalType": "uint64"
                                }
                            ]
                        },
                        {
                            "name": "dstEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "receiver",
                            "type": "address",
                            "internalType": "address"
                        },
                        {
                            "name": "guid",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "value",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "executor",
                            "type": "address",
                            "internalType": "address"
                        },
                        {
                            "name": "message",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "extraData",
                            "type": "bytes",
                            "internalType": "bytes"
                        }
                    ]
                }
            ],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "lzReceiveSimulate",
            "inputs": [
                {
                    "name": "_origin",
                    "type": "tuple",
                    "internalType": "struct Origin",
                    "components": [
                        {
                            "name": "srcEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "sender",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "nonce",
                            "type": "uint64",
                            "internalType": "uint64"
                        }
                    ]
                },
                {
                    "name": "_guid",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "_message",
                    "type": "bytes",
                    "internalType": "bytes"
                },
                {
                    "name": "_executor",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_extraData",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "msgInspector",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "nextNonce",
            "inputs": [
                {
                    "name": "",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [
                {
                    "name": "nonce",
                    "type": "uint64",
                    "internalType": "uint64"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "oApp",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "oAppVersion",
            "inputs": [],
            "outputs": [
                {
                    "name": "senderVersion",
                    "type": "uint64",
                    "internalType": "uint64"
                },
                {
                    "name": "receiverVersion",
                    "type": "uint64",
                    "internalType": "uint64"
                }
            ],
            "stateMutability": "pure"
        },
        {
            "type": "function",
            "name": "oftVersion",
            "inputs": [],
            "outputs": [
                {
                    "name": "interfaceId",
                    "type": "bytes4",
                    "internalType": "bytes4"
                },
                {
                    "name": "version",
                    "type": "uint64",
                    "internalType": "uint64"
                }
            ],
            "stateMutability": "pure"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "peers",
            "inputs": [
                {
                    "name": "eid",
                    "type": "uint32",
                    "internalType": "uint32"
                }
            ],
            "outputs": [
                {
                    "name": "peer",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "preCrime",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "quoteOFT",
            "inputs": [
                {
                    "name": "_sendParam",
                    "type": "tuple",
                    "internalType": "struct SendParam",
                    "components": [
                        {
                            "name": "dstEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "to",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "amountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "minAmountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "extraOptions",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "composeMsg",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "oftCmd",
                            "type": "bytes",
                            "internalType": "bytes"
                        }
                    ]
                }
            ],
            "outputs": [
                {
                    "name": "oftLimit",
                    "type": "tuple",
                    "internalType": "struct OFTLimit",
                    "components": [
                        {
                            "name": "minAmountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "maxAmountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ]
                },
                {
                    "name": "oftFeeDetails",
                    "type": "tuple[]",
                    "internalType": "struct OFTFeeDetail[]",
                    "components": [
                        {
                            "name": "feeAmountLD",
                            "type": "int256",
                            "internalType": "int256"
                        },
                        {
                            "name": "description",
                            "type": "string",
                            "internalType": "string"
                        }
                    ]
                },
                {
                    "name": "oftReceipt",
                    "type": "tuple",
                    "internalType": "struct OFTReceipt",
                    "components": [
                        {
                            "name": "amountSentLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "amountReceivedLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "quoteSend",
            "inputs": [
                {
                    "name": "_sendParam",
                    "type": "tuple",
                    "internalType": "struct SendParam",
                    "components": [
                        {
                            "name": "dstEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "to",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "amountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "minAmountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "extraOptions",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "composeMsg",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "oftCmd",
                            "type": "bytes",
                            "internalType": "bytes"
                        }
                    ]
                },
                {
                    "name": "_payInLzToken",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "outputs": [
                {
                    "name": "msgFee",
                    "type": "tuple",
                    "internalType": "struct MessagingFee",
                    "components": [
                        {
                            "name": "nativeFee",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "lzTokenFee",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "send",
            "inputs": [
                {
                    "name": "_sendParam",
                    "type": "tuple",
                    "internalType": "struct SendParam",
                    "components": [
                        {
                            "name": "dstEid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "to",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "amountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "minAmountLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "extraOptions",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "composeMsg",
                            "type": "bytes",
                            "internalType": "bytes"
                        },
                        {
                            "name": "oftCmd",
                            "type": "bytes",
                            "internalType": "bytes"
                        }
                    ]
                },
                {
                    "name": "_fee",
                    "type": "tuple",
                    "internalType": "struct MessagingFee",
                    "components": [
                        {
                            "name": "nativeFee",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "lzTokenFee",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ]
                },
                {
                    "name": "_refundAddress",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "msgReceipt",
                    "type": "tuple",
                    "internalType": "struct MessagingReceipt",
                    "components": [
                        {
                            "name": "guid",
                            "type": "bytes32",
                            "internalType": "bytes32"
                        },
                        {
                            "name": "nonce",
                            "type": "uint64",
                            "internalType": "uint64"
                        },
                        {
                            "name": "fee",
                            "type": "tuple",
                            "internalType": "struct MessagingFee",
                            "components": [
                                {
                                    "name": "nativeFee",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "lzTokenFee",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "oftReceipt",
                    "type": "tuple",
                    "internalType": "struct OFTReceipt",
                    "components": [
                        {
                            "name": "amountSentLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "amountReceivedLD",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ]
                }
            ],
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "setDelegate",
            "inputs": [
                {
                    "name": "_delegate",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setEnforcedOptions",
            "inputs": [
                {
                    "name": "_enforcedOptions",
                    "type": "tuple[]",
                    "internalType": "struct EnforcedOptionParam[]",
                    "components": [
                        {
                            "name": "eid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "msgType",
                            "type": "uint16",
                            "internalType": "uint16"
                        },
                        {
                            "name": "options",
                            "type": "bytes",
                            "internalType": "bytes"
                        }
                    ]
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setMsgInspector",
            "inputs": [
                {
                    "name": "_msgInspector",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setPeer",
            "inputs": [
                {
                    "name": "_eid",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "_peer",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setPreCrime",
            "inputs": [
                {
                    "name": "_preCrime",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "sharedDecimals",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint8",
                    "internalType": "uint8"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "token",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                {
                    "name": "newOwner",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "EnforcedOptionSet",
            "inputs": [
                {
                    "name": "_enforcedOptions",
                    "type": "tuple[]",
                    "indexed": false,
                    "internalType": "struct EnforcedOptionParam[]",
                    "components": [
                        {
                            "name": "eid",
                            "type": "uint32",
                            "internalType": "uint32"
                        },
                        {
                            "name": "msgType",
                            "type": "uint16",
                            "internalType": "uint16"
                        },
                        {
                            "name": "options",
                            "type": "bytes",
                            "internalType": "bytes"
                        }
                    ]
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "MsgInspectorSet",
            "inputs": [
                {
                    "name": "inspector",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OFTReceived",
            "inputs": [
                {
                    "name": "guid",
                    "type": "bytes32",
                    "indexed": true,
                    "internalType": "bytes32"
                },
                {
                    "name": "srcEid",
                    "type": "uint32",
                    "indexed": false,
                    "internalType": "uint32"
                },
                {
                    "name": "toAddress",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amountReceivedLD",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OFTSent",
            "inputs": [
                {
                    "name": "guid",
                    "type": "bytes32",
                    "indexed": true,
                    "internalType": "bytes32"
                },
                {
                    "name": "dstEid",
                    "type": "uint32",
                    "indexed": false,
                    "internalType": "uint32"
                },
                {
                    "name": "fromAddress",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amountSentLD",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "amountReceivedLD",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "previousOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "PeerSet",
            "inputs": [
                {
                    "name": "eid",
                    "type": "uint32",
                    "indexed": false,
                    "internalType": "uint32"
                },
                {
                    "name": "peer",
                    "type": "bytes32",
                    "indexed": false,
                    "internalType": "bytes32"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "PreCrimeSet",
            "inputs": [
                {
                    "name": "preCrimeAddress",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "AddressEmptyCode",
            "inputs": [
                {
                    "name": "target",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "AddressInsufficientBalance",
            "inputs": [
                {
                    "name": "account",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "FailedInnerCall",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidDelegate",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidEndpointCall",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidLocalDecimals",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidOptions",
            "inputs": [
                {
                    "name": "options",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ]
        },
        {
            "type": "error",
            "name": "LzTokenUnavailable",
            "inputs": []
        },
        {
            "type": "error",
            "name": "NoPeer",
            "inputs": [
                {
                    "name": "eid",
                    "type": "uint32",
                    "internalType": "uint32"
                }
            ]
        },
        {
            "type": "error",
            "name": "NotEnoughNative",
            "inputs": [
                {
                    "name": "msgValue",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ]
        },
        {
            "type": "error",
            "name": "OnlyEndpoint",
            "inputs": [
                {
                    "name": "addr",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "OnlyPeer",
            "inputs": [
                {
                    "name": "eid",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "sender",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ]
        },
        {
            "type": "error",
            "name": "OnlySelf",
            "inputs": []
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                {
                    "name": "account",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "SafeERC20FailedOperation",
            "inputs": [
                {
                    "name": "token",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "SimulationResult",
            "inputs": [
                {
                    "name": "result",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ]
        },
        {
            "type": "error",
            "name": "SlippageExceeded",
            "inputs": [
                {
                    "name": "amountLD",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "minAmountLD",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ]
        }
    ] as const;
