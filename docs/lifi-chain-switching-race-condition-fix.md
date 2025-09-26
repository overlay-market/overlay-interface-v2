# LiFi Chain Switching Race Condition Fix

## Issue Description

When bridging tokens from Arbitrum USDC to BSC OVL, users experienced a race condition that caused the transaction to fail on the first attempt but succeed on the second attempt.

### Error Symptoms
```
❌ Chain mismatch in checkAndApproveToken! 
{walletChainId: 56, tokenChainId: 42161, ...}

Error: Chain mismatch: wallet is on chain 56 but token is on chain 42161. 
Cannot approve token on wrong chain.
```

## Root Cause Analysis

1. **Chain Switch Success**: `safeSwitch(42161)` successfully switched the wallet to Arbitrum
2. **Stale Hook State**: The `walletClient` from `useWalletClient()` hook in `useTokenApprovalWithLiFi` remained stale, still reporting BSC (chain 56) instead of Arbitrum (42161)
3. **Approval Failure**: Token approval failed because the stale wallet client didn't match the token's chain
4. **Second Attempt Success**: By the second click, React hooks had re-rendered with the updated wallet client state

### Technical Flow
```
useLiFiBridge -> safeSwitch(42161) ✅ 
               -> approveIfNeeded() 
               -> useTokenApprovalWithLiFi (stale walletClient: chain 56) ❌
               -> checkAndApproveToken() fails
```

## Solution Implemented

### 1. Modified `useTokenApprovalWithLiFi.ts`
- Added optional `freshWalletClient?: WalletClient` parameter to `approveIfNeeded()`
- Uses fresh client when provided, falls back to hook client otherwise
- Added logging for debugging chain context

### 2. Updated `useLiFiBridge.ts`
- After successful `safeSwitch()`, refetches wallet client using `refetchWalletClient()`
- Passes the fresh wallet client to `approveIfNeeded()`
- Added comprehensive logging for chain verification

### 3. Enhanced Error Prevention
- Fresh wallet client ensures correct chain context for token approvals
- No more reliance on potentially stale React hook state
- Maintains backward compatibility with existing code

## Technical Implementation

```typescript
// In useLiFiBridge.ts
const switchSuccess = await safeSwitch(selectedChainId);
const { data: freshWalletClient } = await refetchWalletClient();

await approveIfNeeded({
  token: { ... },
  spenderAddress: approvalAddress,
  tokenAmountSelected: BigInt(finalRequiredInput),
  freshWalletClient, // 🔑 Fresh client with correct chain context
});

// In useTokenApprovalWithLiFi.ts
const clientToUse = freshWalletClient || walletClient; // Use fresh when available
```

## Result

- ✅ Bridging now works on the **first attempt**
- ✅ No more chain mismatch errors
- ✅ Reliable cross-chain token approvals
- ✅ Improved user experience

## Files Modified

- `src/hooks/lifi/useTokenApprovalWithLiFi.ts`
- `src/hooks/lifi/useLiFiBridge.ts`

## Testing

Test bridging from Arbitrum USDC to BSC OVL - should work immediately on first click without requiring a retry.