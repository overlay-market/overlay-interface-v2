# Execute Routes/Quotes

> We allow you to execute any on-chain or cross-chain swap and bridging transfer and a combination of both.

The LI.FI SDK offers functionality to execute routes and quotes. In this guide, you'll learn how to utilize the SDK's features to handle complex cross-chain transfers, manage execution settings, and control the transaction flow.

## Execute route

Let's say you have obtained the route. Refer to [Request Routes/Quotes](https://docs.li.fi/integrate-li.fi-sdk/request-routes-quotes) for more details.

Please make sure you've configured SDK with EVM/Solana providers. Refer to [Configure SDK Providers](https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers) for more details.

Now, to execute the route, we can use the `executeRoute` function. Here is a simplified example of how to use it:

```typescript
import { executeRoute, getRoutes } from '@lifi/sdk'

const result = await getRoutes({
  fromChainId: 42161, // Arbitrum
  toChainId: 10, // Optimism
  fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
  // The address from which the tokens are being transferred.
  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0', 
})

const route = result.routes[0]

const executedRoute = await executeRoute(route, {
  // Gets called once the route object gets new updates
  updateRouteHook(route) {
    console.log(route)
  },
})
```

The `executeRoute` function internally manages allowance and balance checks, chain switching, transaction data retrieval, transactions submission, and transactions status tracking.

* **Parameters:**

  * `route` (`Route`): The route to be executed.

  * `executionOptions` (`ExecutionOptions`, optional): An object containing settings and callbacks for execution.
* **Returns:**

  * `Promise<RouteExtended>`: Resolves when execution is done or halted and rejects when it is failed.

### Execution Options

All execution options are optional, but we recommend reviewing their descriptions to determine which ones may be beneficial for your use case.

Certain options, such as [acceptExchangeRateUpdateHook](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#acceptexchangerateupdatehook), can be crucial for successfully completing a transfer if the exchange rate changes during the process.

#### `updateRouteHook`

The function is called when the route object changes during execution. This function allows you to handle route updates, track execution status, transaction hashes, etc. See [Monitor route execution](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#monitor-route-execution) section for more details.

* **Parameters**:

  * `updatedRoute` (`RouteExtended`): The updated route object.

#### `updateTransactionRequestHook`

The function is intended for advanced usage, and it allows you to modify swap/bridge transaction requests or token approval requests before they are sent, e.g., updating gas information.

* **Parameters**:

  * `updatedTxRequest` (`TransactionRequestParameters`): The transaction request parameters need to be updated.
* **Returns**: `Promise<TransactionParameters>`: The modified transaction parameters.

#### `acceptExchangeRateUpdateHook`

This function is called whenever the exchange rate changes during a swap or bridge operation. It provides you with the old and new amount values. To continue the execution, you should return `true`. If this hook is not provided or if you return `false`, the SDK will throw an error. This hook is an ideal place to prompt your users to accept the new exchange rate.

* **Parameters**:

  * `toToken` (`Token`): The destination token.

  * `oldToAmount` (`string`): The previous amount of the target token.

  * `newToAmount` (`string`): The new amount of the target token.

* **Returns**: `Promise<boolean | undefined>`: Whether the update is accepted.

* **Throws:** `TransactionError: Exchange rate has changed!`

#### `switchChainHook`

* **Parameters**:

  * `chainId` (`number`): The ID of the chain to which to switch.
* **Returns**: `Promise<WalletClient | undefined>`: The new wallet client after switching chains.

#### `executeInBackground`

A boolean flag indicating whether the route execution should continue in the background without requiring user interaction. See [Update route execution](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#update-route-execution) and [Resume route execution](https://docs.li.fi/integrate-li.fi-sdk/execute-routes-quotes#resume-route-execution) sections for details on how to utilize this option.

* **Type**: `boolean`

* **Default**: `false`

#### `disableMessageSigning`

A boolean flag indicating whether to disable message signing during execution. Certain operations require signing EIP-712 messages, including Permit approvals (ERC-2612) and gasless transactions. This functionality may not be compatible with all smart accounts or wallets, in which case this flag should be set to true to disable message signing.

* **Type**: `boolean`

* **Default**: `false`

## Manage route execution

After starting route execution, there might be use cases when you need to adjust execution settings, stop execution and come back later, or move execution to the background. We provide several functions to achieve that.

### Update route execution

The `updateRouteExecution` function is used to update the settings of an ongoing route execution.

One common use case is to push the execution to the background, for example, when a user navigates away from the execution page in your dApp. When this function is called, the execution will continue until it requires user interaction (e.g., signing a transaction or switching the chain). At that point, the execution will halt, and the `executeRoute` promise will be resolved.

To move the execution back to the foreground and make it active again, you can call `resumeRoute` with the same route object. The execution will then resume from where it was halted.

```typescript
import { updateRouteExecution } from '@lifi/sdk'

updateRouteExecution(route, { executeInBackground: true });
```

* **Parameters:**

  * `route` (`Route`): The active route to be updated.

  * `executionOptions` (`ExecutionOptions`, **required**): An object containing settings and callbacks for execution.

### Resume route execution

The `resumeRoute` function is used to resume a halted, aborted, or failed route execution from the point where it stopped. It is crucial to call `resumeRoute` with the latest active route object returned from the `executeRoute` function or the most recent version of the updated route object from the `updateRouteHook`.

#### Common Use Cases

* **Move Execution to Foreground**: When a user navigates back to the execution page in your dApp, you can call this function to move the execution back to the foreground. The execution will resume from where it was halted.

* **Page Refresh**: If the user refreshes the page in the middle of the execution process, calling this function will attempt to resume the execution.

* **User Interaction Errors**: If the user rejects a chain switch, declines to sign a transaction, or encounters any other error, you can call this function to attempt to resume the execution.

```typescript
import { resumeRoute } from '@lifi/sdk'

const route = await resumeRoute(route, { executeInBackground: false });
```

* **Parameters:**

  * `route` (`Route`): The route to be resumed to execution.

  * `executionOptions` (`ExecutionOptions`, optional): An object containing settings and callbacks for execution.
* **Returns:**

  * `Promise<RouteExtended>`: Resolves when execution is done or halted and rejects when it is failed.

### Stop route execution

The `stopRouteExecution` function is used to stop the ongoing execution of an active route. It stops any remaining user interaction within the ongoing execution and removes the route from the execution queue. However, if a transaction has already been signed and sent by the user, it will be executed on-chain.

```typescript
import { stopRouteExecution } from '@lifi/sdk'

const stoppedRoute = stopRouteExecution(route);
```

* **Parameters:**

  * `route` (`Route`): The route that is currently being executed and needs to be stopped.
* **Returns:**

  * `Route`: The route object that was stopped.

## Monitor route execution

Monitoring route execution is important and we provide tools for tracking progress, receiving data updates, accessing transaction hashes, and explorer links.

### Brief description of steps

A `route` object includes multiple `step` objects, each representing a set of transactions that should be completed in the specified order. Each step can include multiple transactions that require a signature, such as an allowance transaction followed by the main swap or bridge transaction. Read more [LI.FI Terminology](https://docs.li.fi/overview/li.fi-terminology).

### Understanding the `execution` object

Each `step` within a `route` has an `execution` object. This object contains all the necessary information to track the execution progress of that step. The `execution` object has a `process` array where each entry represents a sequential stage in the execution. The latest process entry contains the most recent information about the execution stage.

### Process array

The `process` array within the `execution` object details each step’s progression. Each `process` object has a type and status and might also include a transaction hash and a link to a blockchain explorer after the user signs the transaction.

### Tracking progress

To monitor the execution progress, you leverage the `updateRouteHook` callback and iterate through the route steps, checking their `execution` objects. Look at the `process` array to get the latest information about the execution stage. The most recent entry in the `process` array will contain the latest transaction hash, status, and other relevant details.

### Example to access transaction hashes

```typescript
const getTransactionLinks = (route: RouteExtended) => {
  route.steps.forEach((step, index) => {
    step.execution?.process.forEach((process) => {
      if (process.txHash) {
        console.log(
          `Transaction Hash for Step ${index + 1}, Process ${process.type}:`,
          process.txHash
        )
      }
    })
  })
}

const executedRoute = await executeRoute(route, {
  updateRouteHook(route) {
    getTransactionLinks(route)
  },
})
```

### Get active routes

To get routes that are currently being executed (active), you can use `getActiveRoutes` and `getActiveRoute` functions.

```typescript
import { getActiveRoute, getActiveRoutes, RouteExtended } from '@lifi/sdk'

const activeRoutes: RouteExtended[] = getActiveRoutes();

const routeId = activeRoutes[0].routeId;

const activeRoute = getActiveRoute(routeId);
```

## Execute quote

To execute a quote using the `executeRoute`, you need to convert it to a route object first. We provide `convertQuoteToRoute` helper function to transform quote objects to route objects. This applies to both standard and contract call quotes.

```typescript
import { convertQuoteToRoute, executeRoute, getQuote } from '@lifi/sdk';

const quoteRequest: QuoteRequest = {
  fromChain: 42161, // Arbitrum
  toChain: 10, // Optimism
  fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
  // The address from which the tokens are being transferred.
  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0', 
};

const quote = await getQuote(quoteRequest);

const route = convertQuoteToRoute(quote)

const executedRoute = await executeRoute(route, {
  // Gets called once the route object gets new updates
  updateRouteHook(route) {
    console.log(route)
  },
})
```

## Manual route execution

In addition to using the `executeRoute` function, you can execute routes and quotes manually. This approach requires developers to handle the logic for obtaining transaction data, switching chains, sending transactions, and tracking transaction status independently.

Initially, when route objects are requested, they do not include transaction data. This is because multiple route options are provided, and generating transaction data for all options would substantially delay the response. Each route consists of multiple steps, and once a user selects a route, transaction data for each step should be requested individually using the `getStepTransaction` function (see example below). Each step should be executed sequentially, as each step depends on the outcome of the previous one.

On the other hand, quote objects are returned with transaction data included, so the `getStepTransaction` call is not necessary, and they can be executed immediately.

After sending a transaction using the obtained transaction data, you can track the status of the transaction using the `getStatus` function. This function helps you monitor the progress and completion of each transaction. Read more [Status of a Transaction](https://docs.li.fi/li.fi-api/li.fi-api/status-of-a-transaction).

Here's a simplified example. For the sake of simplicity, this example omits balance checks, transaction replacements, error handling, chain switching, etc. However, in a real implementation, you should include these additional functionalities to have a robust solution and ensure reliability.

```typescript
import { getStepTransaction, getStatus } from '@lifi/sdk';

// Simplified example function to execute each step of the route sequentially
async function executeRouteSteps(route) {
  for (const step of route.steps) {
    // Request transaction data for the current step
    const step = await getStepTransaction(step);
    
    // Send the transaction (e.g. using Viem)
    const transactionHash = await sendTransaction(step.transactionRequest);
    
    // Monitor the status of the transaction
    let status;
    do {
      const result = await getStatus({
        txHash: transactionHash,
        fromChain: step.action.fromChainId,
        toChain: step.action.toChainId,
        bridge: step.tool,
      })
      status = result.status
      
      console.log(`Transaction status for ${transactionHash}:`, status);
      
      // Wait for a short period before checking the status again
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } while (status !== 'DONE' && status !== 'FAILED');
    
    if (status === 'FAILED') {
      console.error(`Transaction ${transactionHash} failed`);
      return;
    }
  }
  
  console.log('All steps executed successfully');
}
```

#### `getStepTransaction`

* **Parameters:**

  * `step` (`LiFiStep`): The step object for which we need to get transaction data.

  * `options` (`RequestOptions`, optional): An object containing request options, such as `AbortSignal`, which can be used to cancel the request if necessary.
* **Returns:**

  * `Promise<LiFiStep>`: A promise that resolves to the step object containing the transaction data.

#### `getStatus`

* **Parameters:**

  * `params` (`GetStatusRequest`): The parameters for checking the status include the transaction hash, source and destination chain IDs, and the DEX or bridge name.

  * `options` (`RequestOptions`, optional): An object containing request options, such as `AbortSignal`, which can be used to cancel the request if necessary.
* **Returns:**

  * `Promise<StatusResponse>`: A promise that resolves to a status response containing all relevant information about the transfer.
