# Token Management

> Request all available tokens and their balances, manage token approvals and more.

## Get available tokens

### `getTokens`

Retrieves a list of all available tokens on specified chains.

**Parameters**

* `params` (TokensRequest, optional): Configuration for the requested tokens.

  * `chains` (ChainId\[], optional): List of chain IDs or keys. If not specified, returns tokens on all available chains.

  * `chainTypes` (ChainType\[], optional): List of chain types.
* `options` (RequestOptions, optional): Additional request options.

**Returns**

A Promise that resolves to `TokensResponse`

```typescript Example
import { ChainType, getTokens } from '@lifi/sdk';

try {
  const tokens = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM],
  });
  console.log(tokens);
} catch (error) {
  console.error(error);
}
```

### `getToken`

Fetches details about a specific token on a specified chain.

**Parameters**

* `chain` (ChainKey | ChainId): ID or key of the chain that contains the token.

* `token` (string): Address or symbol of the token on the requested chain.

* `options` (RequestOptions, optional): Additional request options.

**Returns**

A Promise that resolves to `Token` object.

```typescript Example
import { getToken } from '@lifi/sdk';

const chainId = 1;
const tokenAddress = '0x0000000000000000000000000000000000000000';

try {
  const token = await getToken(chainId, tokenAddress);
  console.log(token);
} catch (error) {
  console.error(error);
}
```

## Get token balance

Please ensure that you configure the SDK with EVM/Solana providers first. They are required to use this functionality. Additionally, it is recommended to provide your private RPC URLs, as public ones are used by default and may rate limit you for multiple requests, such as getting the balance of multiple tokens at once.

Read more [Configure SDK Providers](https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers).

### `getTokenBalance`

Returns the balance of a specific token a wallet holds.

**Parameters**

* `walletAddress` (string): A wallet address.

* `token` (Token): A Token object.

**Returns**

A Promise that resolves to a `TokenAmount` or `null`.

```typescript Example
import { getToken, getTokenBalance } from '@lifi/sdk';

const chainId = 1;
const tokenAddress = '0x0000000000000000000000000000000000000000';
const walletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';

try {
  const token = await getToken(chainId, tokenAddress);
  const tokenBalance = await getTokenBalance(walletAddress, token);
  console.log(tokenBalance);
} catch (error) {
  console.error(error);
}
```

### `getTokenBalances`

Returns the balances for a list of tokens a wallet holds.

**Parameters**

* `walletAddress` (string): A wallet address.

* `tokens` (Token\[]): A list of Token objects.

**Returns**

A Promise that resolves to a list of `TokenAmount` objects.

```typescript Example
import { ChainId, getTokenBalances, getTokens } from '@lifi/sdk';

const walletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';

try {
  const tokensResponse = await getTokens();
  const optimismTokens = tokensResponse.tokens[ChainId.OPT];
  const tokenBalances = await getTokenBalances(walletAddress, optimismTokens);
  console.log(tokenBalances);
} catch (error) {
  console.error(error);
}
```

### `getTokenBalancesByChain`

Queries the balances of tokens for a specific list of chains for a given wallet.

**Parameters**

* `walletAddress` (string): A wallet address.

* `tokensByChain` \[chainId: number]: Token\[]: A list of Token objects organized by chain IDs.

**Returns**

A Promise that resolves to an object containing the tokens and their amounts on different chains.

```typescript Example
import { getTokenBalancesByChain } from '@lifi/sdk';

const walletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';
const tokensByChain = {
  1: [
    {
      chainId: 1,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18,
      priceUSD: '0.9999',
    },
  ],
  10: [
    {
      chainId: 10,
      address: '0x4200000000000000000000000000000000000042',
      symbol: 'OP',
      name: 'Optimism',
      decimals: 18,
      priceUSD: '1.9644',
    },
  ],
};

try {
  const balances = await getTokenBalancesByChain(walletAddress, tokensByChain);
  console.log(balances);
} catch (error) {
  console.error(error);
}
```

## Managing token allowance

Token allowance and approval functionalities are specific to EVM (Ethereum Virtual Machine) chains. It allows smart contracts to interact with ERC-20 tokens by approving a certain amount of tokens that a contract can spend from the user's wallet.

Please ensure that you configure the SDK with the EVM provider. It is required to use this functionality.

Read more [Configure SDK Providers](https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers).

### `getTokenAllowance`

Fetches the current allowance for a specific token.

**Parameters**

* `token` (BaseToken): The token for which to check the allowance.

* `ownerAddress` (string): The owner of the token.

* `spenderAddress` (string): The spender address that was approved.

**Returns**

A Promise that resolves to a `bigint` representing the allowance or undefined if the token is a native token.

```typescript Example
import { getTokenAllowance } from '@lifi/sdk';

const token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chainId: 1,
};

const ownerAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';
const spenderAddress = '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE';

try {
  const allowance = await getTokenAllowance(token, ownerAddress, spenderAddress);
  console.log('Allowance:', allowance);
} catch (error) {
  console.error('Error:', error);
}
```

### `getTokenAllowanceMulticall`

Fetches the current allowance for a list of token/spender address pairs.

**Parameters**

* `ownerAddress` (string): The owner of the tokens.

* `tokens` (TokenSpender\[]): A list of token and spender address pairs.

**Returns**

A Promise that resolves to an array of `TokenAllowance` objects.

```typescript Example
import { getTokenAllowanceMulticall } from '@lifi/sdk';

const ownerAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0';
const tokens = [
  {
    token: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: 1,
    },
    spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  },
  {
    token: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      chainId: 1,
    },
    spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  },
];

try {
  const allowances = await getTokenAllowanceMulticall(ownerAddress, tokens);
  console.log('Allowances:', allowances);
} catch (error) {
  console.error('Error:', error);
}
```

### `setTokenAllowance`

Sets the token allowance for a specific token and spender address.

**Parameters**

* `request` (ApproveTokenRequest): The approval request.

  * `walletClient` (WalletClient): The wallet client used to send the transaction.

  * `token` (BaseToken): The token for which to set the allowance.

  * `spenderAddress` (string): The address of the spender.

  * `amount` (bigint): The amount of tokens to approve.

  * `infiniteApproval` (boolean, optional): If true, sets the approval to the maximum uint256 value.

**Returns**

A Promise that resolves to a `Hash` representing the transaction hash or `void` if no transaction is needed (e.g., for native tokens).

```typescript Example
import { setTokenAllowance } from '@lifi/sdk';

const approvalRequest = {
  walletClient: walletClient, // Viem wallet client
  token: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
  },
  spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  amount: 100000000n,
};

try {
  const txHash = await setTokenAllowance(approvalRequest);
  console.log('Transaction Hash:', txHash);
} catch (error) {
  console.error('Error:', error);
}
```

### `revokeTokenApproval`

Revokes the token approval for a specific token and spender address.

**Parameters**

* `request` (RevokeApprovalRequest): The revoke request.

  * `walletClient` (WalletClient): The wallet client used to send the transaction.

  * `token` (BaseToken): The token for which to revoke the allowance.

  * `spenderAddress` (string): The address of the spender.

**Returns**

A Promise that resolves to a `Hash` representing the transaction hash or `void` if no transaction is needed (e.g., for native tokens).

```typescript Example
import { revokeTokenApproval } from '@lifi/sdk';

const revokeRequest = {
  walletClient: walletClient, // Viem wallet client
  token: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
  },
  spenderAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
};

try {
  const txHash = await revokeTokenApproval(revokeRequest);
  console.log('Transaction Hash:', txHash);
} catch (error) {
  console.error('Error:', error);
}
```
