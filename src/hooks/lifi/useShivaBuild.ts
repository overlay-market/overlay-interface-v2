import { Address, encodeFunctionData, getContract, Hex } from "viem";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { SHIVA_ADDRESS } from "../../constants/applications";
import { useCallback } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { ShivaABI } from "./abi/Shiva";

const EIP712_DOMAIN = {
  name: 'Shiva',
  version: '1',
  chainId: DEFAULT_CHAINID as number,
  verifyingContract: SHIVA_ADDRESS[DEFAULT_CHAINID as number] as Address 
};

const EIP712_TYPES = {
  BuildOnBehalfOf: [
    { name: 'ovlMarket', type: 'address' },
    { name: 'brokerId', type: 'uint32' },
    { name: 'isLong', type: 'bool' },
    { name: 'collateral', type: 'uint256' },
    { name: 'leverage', type: 'uint256' },
    { name: 'priceLimit', type: 'uint256' },
    { name: 'owner', type: 'address' },
    { name: 'deadline', type: 'uint48' },
    { name: 'nonce', type: 'uint256' }
  ]
};

export interface BuildOnBehalfOfParams {
  marketAddress: Address;
  brokerId?: number;
  isLong: boolean;
  collateral: bigint;
  leverage: bigint;
  priceLimit: bigint;
  owner: Address; 
  deadline: number; 
}

function randomUint256(): bigint {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return BigInt("0x" + Array.from(array, b => b.toString(16).padStart(2, "0")).join(""));
}

export const useShivaBuild = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const getFreeNonce = useCallback(
  async (owner: Address): Promise<bigint> => {
    if (!publicClient) throw new Error("publicClient is undefined");

    const shivaContract = getContract({
      address: SHIVA_ADDRESS[DEFAULT_CHAINID as number] as Address,
      abi: ShivaABI,
      client: publicClient,
    });

    while (true) {
      const nonce = randomUint256();
      const used = await shivaContract.read.usedNonces([owner, nonce]);
      if (!used) return nonce;
    }
  },
  [publicClient]
);

  const generateSignature = useCallback(async (
    params: BuildOnBehalfOfParams,
    nonce: bigint,
  ): Promise<`0x${string}`> => {
    if (!walletClient) throw new Error('Wallet client is not available');    

    const message = {
      ovlMarket: params.marketAddress,
      brokerId: (params.brokerId ?? 0).toString(),
      isLong: params.isLong,
      collateral: params.collateral.toString(),
      leverage: params.leverage.toString(),
      priceLimit: params.priceLimit.toString(),
      owner: params.owner,
      deadline: params.deadline.toString(),
      nonce: nonce.toString(),
    };

    try {
      const signature = await walletClient.signTypedData({
        account: params.owner,
        domain: EIP712_DOMAIN,
        types: EIP712_TYPES,
        primaryType: 'BuildOnBehalfOf',
        message
      });

      return signature;
    } catch (error) {
      console.error('Error signing typed data:', error);
      throw new Error(`Failed to sign: ${error}`);
    }

  
  }, [walletClient]);

  const encodeShivaBuildCall = useCallback(async (
    params: BuildOnBehalfOfParams,
  ): Promise<Hex> => {
    const nonce = await getFreeNonce(params.owner);
  
    const signature = await generateSignature(params, nonce);

    if (!signature) {
      throw new Error("Failed to generate signature");
    }

    return encodeFunctionData({
      abi: ShivaABI,
      functionName: 'build',
      args: [
        {
          ovlMarket: params.marketAddress,
          brokerId: params.brokerId ?? 0,
          isLong: params.isLong,
          collateral: params.collateral,
          leverage: params.leverage,
          priceLimit: params.priceLimit,
        },
        {
          owner: params.owner,
          deadline: params.deadline,
          nonce: nonce,
          signature: signature,
        }
      ],
    });
  }, [getFreeNonce, generateSignature]);

  return { encodeShivaBuildCall };
};