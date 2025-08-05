import { getTokenAllowance, setTokenAllowance } from '@lifi/sdk';
import type { Address, Hash, WalletClient } from 'viem';
import { Token } from '../../types/selectChainAndTokenTypes';

export const checkAndApproveToken = async ({
  walletClient,
  token,
  ownerAddress,
  spenderAddress,
  tokenAmountSelected,
}: {
  walletClient: WalletClient;
  token: Token;
  ownerAddress: Address;
  spenderAddress: Address;
  tokenAmountSelected: bigint;
}): Promise<Hash | null> => {
  const allowance = await getTokenAllowance(token, ownerAddress, spenderAddress);

  if (typeof allowance === 'undefined') {
    return null; // Native token, no approval needed
  }

  if (allowance < tokenAmountSelected) {
    const txHash = await setTokenAllowance({
      walletClient,
      token,
      spenderAddress,
      amount: tokenAmountSelected,
      infiniteApproval: true,
    });

    return txHash ?? null;
  }

  return null; 
};