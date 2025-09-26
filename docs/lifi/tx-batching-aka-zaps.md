# Tx Batching aka "Zaps"

> LI.FI Zaps (Contract Calls) Documentation

## Overview

LI.FI Zaps, also referred to as "contract calls" or "transaction batching," provide a streamlined way to bundle multiple actions within a single transaction on same-chain or cross-chain. Zaps are designed to simplify complex workflows, such as swapping tokens, bridging assets, and interacting with DeFi protocols, by executing them in a single, atomic transaction. This approach reduces the need for multiple steps, lowers gas fees, and enhances the user experience.

***

## Key Benefits of LI.FI Zaps

* **Single Transaction Execution**: Zaps allow multiple actions to be completed in one transaction, eliminating the need for users to sign and pay for each individual action separately.
* **Cost Efficiency**: By batching actions into a single transaction, Zaps reduce gas costs, as each step in a multi-action sequence does not require its own transaction fee.
* **Improved User Experience**: Zaps minimize the complexity of on-chain interactions by consolidating them, making it easier for users to perform multi-step operations without extensive technical knowledge.
* **Atomic Transactions (same-chain only)**: Zaps are executed as atomic transactions (same-chain only), meaning all actions are completed as a single unit or none at all, ensuring security and consistency in execution.

***

## How LI.FI Zaps Work

LI.FI Zaps work by consolidating a series of contract calls into a single transaction through the LI.FI smart contract. This single transaction can perform multiple actions on behalf of the user, such as:

1. **Swapping Tokens**: Convert one asset to another using decentralized exchanges (DEXs).
2. **Bridging Assets**: Transfer assets from one blockchain to another.
3. **Interacting with DeFi Protocols**: Deposit into, withdraw from, or interact with protocols like lending platforms or yield farms.

Each Zap is designed to follow a predefined sequence of actions that are executed through the LI.FI contract, which integrates with various decentralized finance (DeFi) protocols and cross-chain bridges. This integration enables users to perform complex DeFi operations without needing to interact directly with multiple protocols.

***

## Supported Actions in LI.FI Zaps

LI.FI Zaps can support a wide variety of actions, including but not limited to:

* **Swaps**: Perform token swaps on supported DEXs across multiple chains.
* **Bridges**: Bridge assets between different blockchain networks, facilitating cross-chain transfers.
* **Multi-Chain Swaps**: Execute a token swap on one chain, bridge the swapped asset, and convert it again on the destination chain.
* **DeFi Interactions**: Stake, lend, borrow, or provide liquidity on supported DeFi platforms, all within a single transaction.

***

## Example Workflow: Cross-Chain Swap with Zaps

A common use case for LI.FI Zaps is a cross-chain token swap, where a user wants to convert one token on a source chain into another token on a destination chain. Using Zaps, this workflow can be accomplished with a single transaction:

1. **Token Swap on Source Chain**: The initial token is swapped into an intermediary asset that can be bridged to the destination chain.
2. **Bridge Transfer**: The intermediary asset is then bridged to the destination chain.
3. **Token Swap on Destination Chain**: Once the asset arrives on the destination chain, it is swapped into the target token, completing the cross-chain swap.

By using a Zap, LI.FI combines these three steps into one transaction, making the process seamless and efficient for the user.

***

## Technical Details

### Atomicity of Zaps

Zaps are executed as atomic transactions, meaning that either all actions within a Zap are completed successfully, or the transaction fails and is reverted. This atomicity ensures that users do not end up with partially completed actions, which is critical for maintaining security, especially in multi-step cross-chain operations.

### Smart Contract Design

LI.FI Zaps leverage the LI.FI Diamond Contract architecture, which allows for modular, extensible functionality. Each action within a Zap corresponds to a specific function within the contract, and these functions can be updated or expanded without requiring changes to the core contract. This architecture provides flexibility for future updates to the types of actions supported by LI.FI Zaps.

### Supported Protocols and Bridges

Zaps integrate with a variety of DEXs, DeFi protocols, and cross-chain bridges to ensure broad functionality. Examples of supported protocols include:

* **DEXs**: Most DEXs are supported
* **Bridges**: StargateV2, Connext, CelerIM.
* **DeFi Protocols**: Aave, Compound, Yearn, and other leading protocols or virtually any contract.

The list of supported protocols and bridges is continually expanding to ensure that users have access to the latest liquidity sources and DeFi opportunities.

***

## How to Implement LI.FI Zaps

To utilize Zaps, developers can leverage the LI.FI API, which provides endpoints for creating, configuring, and executing Zaps. The API enables developers to set up multi-step transactions according to their requirements.

1. **Request a Quote**: Use the LI.FI API to request a quote for the desired multi-step operation, such as a cross-chain swap.
2. **Generate Zap Configuration**: Configure the steps within the Zap based on the quote and the required actions (e.g., swap, bridge).
3. **Execute Zap**: Send the configured Zap to the LI.FI smart contract, which will handle the multi-step operation within a single transaction.

### Example API Workflow

1. **Quote Request**: Call the `GET /quote` endpoint to retrieve pricing and routing options for the desired Zap.
2. **Zap Execution**: Use the `POST /execute` endpoint to submit the Zap transaction configuration to the LI.FI contract.

For more information on specific API calls and examples, refer to the [LI.FI API documentation](https://docs.li.fi/li.fi-api/).

***

## Use Cases for LI.FI Zaps

* **Cross-Chain Yield Farming**: Deposit an asset on one chain, bridge it to another chain, and deposit into a yield farming protocol in a single transaction.
* **Multi-Chain Arbitrage**: Execute swaps across different chains to exploit arbitrage opportunities without needing separate transactions for each chain.
* **Onboarding New Users to DeFi**: Simplify user onboarding by allowing them to perform multi-step DeFi operations in a single, seamless transaction.
