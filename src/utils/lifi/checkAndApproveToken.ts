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
  // Verify wallet client chain matches token chain to prevent cross-chain approval issues
  if (walletClient.chain?.id !== token.chainId) {
    console.error("❌ Chain mismatch in checkAndApproveToken!", {
      walletChainId: walletClient.chain?.id,
      tokenChainId: token.chainId,
      tokenAddress: token.address,
      spenderAddress
    });
    throw new Error(
      `Chain mismatch: wallet is on chain ${walletClient.chain?.id} but token is on chain ${token.chainId}. ` +
      `Cannot approve token on wrong chain.`
    );
  }

  console.log("🔍 Checking token allowance:", {
    tokenAddress: token.address,
    tokenChainId: token.chainId,
    walletChainId: walletClient.chain?.id,
    ownerAddress,
    spenderAddress,
    amount: tokenAmountSelected.toString()
  });

  const allowance = await getTokenAllowance(token, ownerAddress, spenderAddress);

  if (typeof allowance === 'undefined') {
    console.log("ℹ️ Native token detected, no approval needed");
    return null; // Native token, no approval needed
  }

  console.log("🔍 Token allowance check result:", {
    currentAllowance: allowance.toString(),
    requiredAmount: tokenAmountSelected.toString(),
    needsApproval: allowance < tokenAmountSelected
  });

  if (allowance < tokenAmountSelected) {
    console.log("📝 Setting token allowance...", {
      tokenAddress: token.address,
      spenderAddress,
      amount: tokenAmountSelected.toString(),
      chainId: token.chainId
    });

    const txHash = await setTokenAllowance({
      walletClient,
      token,
      spenderAddress,
      amount: tokenAmountSelected,
      infiniteApproval: true,
    });

    console.log("✅ Token allowance set with tx hash:", txHash);
    return txHash ?? null;
  }

  console.log("✅ Sufficient allowance already exists, no approval needed");
  return null; 
};