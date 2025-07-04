import { Address, getContract, PublicClient } from "viem";

const minimalERC20ABI = [
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
]

// EIP-1967 slot for proxy implementation address
const IMPLEMENTATION_SLOT = '0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC'

export const getTokenSymbol = async(
  tokenAddress: Address,
  publicClient: PublicClient,
): Promise<string> => {

  const tryReadSymbol = async (address: Address): Promise<string> => {
    const contract = getContract({
      address,
      abi: minimalERC20ABI,
      client: publicClient,
    });
    return await contract.read.symbol() as string;
  };

  try {
    return await tryReadSymbol(tokenAddress);
  } catch (err) {
    console.warn(`Direct symbol read failed on ${tokenAddress}, trying as proxy...`);

    try {
      const implSlotRaw = await publicClient.getStorageAt({
        address: tokenAddress,
        slot: IMPLEMENTATION_SLOT,
      });

      const implAddress = implSlotRaw && `0x${implSlotRaw.slice(-40)}` as Address;
      if (!implAddress) return 'UNKNOWN';
      return await tryReadSymbol(implAddress);
    } catch (proxyErr) {
      console.error(`Failed to read symbol from proxy token at ${tokenAddress}`, proxyErr);
      return 'UNKNOWN';
    }
  }
};