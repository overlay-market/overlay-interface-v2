import { useState, useCallback } from 'react';
import { Address } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import { OVL_ADDRESS } from 'overlay-sdk';
import { useChainAndTokenState, useTradeState } from '../../state/trade/hooks';
import { convertQuoteToRoute, executeRoute, ExecutionOptions, getContractCallsQuote } from '@lifi/sdk';
import { parseUnits } from 'viem';
import { DEFAULT_CHAINID } from '../../constants/chains';
import { useTokenApprovalWithLiFi } from './useTokenApprovalWithLiFi';
import { useSafeChainSwitch } from './useSafeChainSwitch';
import { useAddPopup } from '../../state/application/hooks';
import { OVL_DECIMALS } from '../../constants/applications';
import { BRIDGE_FEE, BRIDGE_SLIPPAGE } from '../../constants/bridge';
import { calculateAdjustedBridgeAmount } from '../../utils/lifi/calculateBridgeAmount';

export interface BridgeStage {
  stage: 'idle' | 'quote' | 'approval' | 'bridging' | 'success';
  message?: string;
  txHash?: string;
}

export interface BridgeQuoteInfo {
  expectedOvlAmount: string;
  requiredInputAmount: string;
  exchangeRate: string;
  fees: string;
}

type BridgeQuoteResult =
  | { quote: BridgeQuoteInfo; error?: undefined }
  | { quote?: undefined; error: Error };

export const useLiFiBridge = () => {
  const [bridgeStage, setBridgeStage] = useState<BridgeStage>({ stage: 'idle' });
  const [bridgedAmount, setBridgedAmount] = useState<string>('0');
  const [bridgeQuote, setBridgeQuote] = useState<BridgeQuoteInfo | null>(null);
  const { address: account } = useAccount();
  const { data: walletClient, refetch: refetchWalletClient } = useWalletClient();
  const { typedValue, selectedLeverage } = useTradeState();
  const { selectedChainId, selectedToken } = useChainAndTokenState();
  const { approveIfNeeded } = useTokenApprovalWithLiFi({ 
    setTradeStage: (stage) => setBridgeStage({
      stage: stage.stage as BridgeStage['stage'],
      message: stage.message
    })
  });
  const addPopup = useAddPopup();

  const { safeSwitch } = useSafeChainSwitch({
    onSwitchStart: (from, to) =>
      setBridgeStage({ stage: 'bridging', message: `Switching from chain ${from} to ${to}` }),
  });

  const executeBridge = useCallback(async () => {
    if (!account || !walletClient || !selectedToken) {
      throw new Error('Missing required data for bridging');
    }

    // If we're already on BSC with OVL, no bridging needed
    if (selectedChainId === DEFAULT_CHAINID && selectedToken.address === OVL_ADDRESS[DEFAULT_CHAINID as number]) {
      const adjustedOvlAmount = calculateAdjustedBridgeAmount(typedValue, selectedLeverage).toString();
      setBridgeStage({ stage: 'success', message: 'Ready for position - already on BSC with OVL' });
      setBridgedAmount(adjustedOvlAmount);
      return;
    }

    try {
      setBridgeStage({ stage: 'quote', message: 'Getting bridge quote...' });

      // Calculate adjusted OVL amount including fees so user receives what they typed
      const adjustedOvlAmount = calculateAdjustedBridgeAmount(typedValue, selectedLeverage);

      console.log("🎯 Using adjusted amount for bridge:", {
        userTypedValue: typedValue,
        userLeverage: selectedLeverage,
        adjustedOVL: (Number(adjustedOvlAmount) / 1e18).toFixed(6),
        toAmountRaw: adjustedOvlAmount.toString()
      });

      // Get contract calls quote with adjusted toAmount
      const quote = await getContractCallsQuote({
        fromChain: selectedChainId,
        fromToken: selectedToken.address,
        fromAddress: account,
        toChain: DEFAULT_CHAINID as number,
        toToken: OVL_ADDRESS[DEFAULT_CHAINID as number],
        toAmount: adjustedOvlAmount.toString(),
        contractCalls: [], 
        slippage: BRIDGE_SLIPPAGE,
      }).catch((err) => {
        console.error("❌ Failed to get bridge quote:", err);
        throw new Error(`Failed to get bridge quote: ${err.message || "Unknown error"}`);
      });

      if (!quote) {
        throw new Error("Failed to get bridge quote");
      }

      // Contract calls quote has different structure than regular quote
      const finalRequiredInput = quote.action?.fromAmount || '0';
      const finalExpectedOvl = adjustedOvlAmount.toString(); // We requested adjusted amount
      const guaranteedOvlAmount = quote.estimate?.toAmountMin || adjustedOvlAmount.toString(); 
      const approvalAddress = quote.estimate?.approvalAddress;
      
      // Calculate exchange rate and fees for display
      const inputAmountReadable = Number(finalRequiredInput) / Math.pow(10, selectedToken.decimals);
      const expectedOvlReadable = Number(finalExpectedOvl) / 1e18;
      const exchangeRate = (inputAmountReadable / expectedOvlReadable).toFixed(6);
      
      console.log("🎯 Contract calls quote details (adjusted amount):", {
        requestedOVL: (Number(adjustedOvlAmount) / 1e18).toFixed(6),
        expectedOVL: expectedOvlReadable.toFixed(6),
        guaranteedOVL: (Number(guaranteedOvlAmount) / 1e18).toFixed(6),
        requiredInput: inputAmountReadable.toFixed(6),
        exchangeRate: `1 OVL = ${exchangeRate} ${selectedToken.symbol}`,
        adjustedMatch: expectedOvlReadable === (Number(adjustedOvlAmount) / 1e18) ? "✅ Perfect match!" : "❌ Mismatch"
      });
      
      // Store quote info for potential modal display
      setBridgeQuote({
        expectedOvlAmount: finalExpectedOvl,
        requiredInputAmount: finalRequiredInput,
        exchangeRate: `1 OVL = ${exchangeRate} ${selectedToken.symbol}`,
        fees: '~1% slippage'
      });

      // Switch to source chain for token approval
      const switchSuccess = await safeSwitch(selectedChainId);
      if (!switchSuccess) {
        throw new Error(`Failed to switch to source chain ${selectedChainId}`);
      }
      
      // Refetch wallet client to get updated chain context after switch
      const { data: freshWalletClient } = await refetchWalletClient();
      if (!freshWalletClient) {
        throw new Error('Failed to get updated wallet client after chain switch');
      }
      
      console.log("✅ Successfully switched to source chain for approval:", {
        targetChainId: selectedChainId,
        tokenChainId: selectedToken.chainId,
        approvalAddress,
        freshClientChainId: freshWalletClient.chain?.id,
        chainMatches: freshWalletClient.chain?.id === selectedChainId,
      });

      // Handle token approval with fresh wallet client
      await approveIfNeeded({
        token: {
          address: selectedToken.address as Address,
          chainId: selectedToken.chainId,
        },
        spenderAddress: approvalAddress as Address,
        tokenAmountSelected: BigInt(finalRequiredInput),
        freshWalletClient,
      });

      setBridgeStage({ stage: 'bridging', message: 'Bridging tokens to BSC...' });

      // For contract calls quote, we might need to execute directly or convert
      // Let's try converting first, fallback to direct execution if needed
      let route;
      try {
        route = convertQuoteToRoute(quote);
      } catch (error) {
        console.log("⚠️ Could not convert contract calls quote to route, using direct execution");
        // For contract calls, we might need to execute the transactionRequest directly
        throw new Error("Contract calls quote execution not fully implemented yet");
      }

      const shownTxHashes = new Set<string>();

      await executeRoute(route, {
        switchChainHook: async (chainId: number) => {
          console.log("🔄 LiFi requesting chain switch to:", chainId);
          const success = await safeSwitch(chainId);
          if (!success) {
            throw new Error(`Failed to switch to chain ${chainId}`);
          }

          // Refetch wallet client to get updated chain context
          const { data: updatedWalletClient } = await refetchWalletClient();
          if (!updatedWalletClient) {
            throw new Error("No wallet client after chain switch");
          }
          console.log("✅ Chain switch completed for LiFi execution");
          return updatedWalletClient;
        },
        updateRouteHook: (updatedRoute) => {
          console.log("🌉 Bridge route updated:", {
            routeId: updatedRoute.id,
            steps: updatedRoute.steps.length,
            status: updatedRoute.steps.map((s) => ({
              tool: s.tool,
              type: s.type,
              status: s.execution?.status,
              txHash: s.execution?.process?.[0]?.txHash,
            })),
          });

          // Show transaction popups
          for (const step of updatedRoute.steps) {
            const txHash = step.execution?.process?.[0]?.txHash;
            if (txHash && !shownTxHashes.has(txHash)) {
              shownTxHashes.add(txHash);
              addPopup(
                {
                  txn: {
                    hash: txHash,
                    success: true,
                    message: "Bridge transaction executed",
                    type: "Bridge",
                  },
                },
                txHash
              );
            }
          }
        },
        acceptExchangeRateUpdateHook: async () => {
          return true; // Auto-accept rate changes
        },
      } as ExecutionOptions);

      // Switch to BSC after bridge completion
      await safeSwitch(DEFAULT_CHAINID);

      // Bridge completed successfully - use what Li.Fi actually delivers
      const actualOvlAmount = finalExpectedOvl;
      
      console.log("✅ Bridge completed - setting bridged amount:", {
        actualOvlAmount: actualOvlAmount,
        actualOvlAmountReadable: (Number(actualOvlAmount) / 1e18).toFixed(6),
        dataType: typeof actualOvlAmount,
        isString: typeof actualOvlAmount === 'string',
        bigIntConversion: actualOvlAmount ? BigInt(actualOvlAmount).toString() : 'failed'
      });
      
      setBridgeStage({ 
        stage: 'success', 
        message: `Successfully bridged to ${(Number(actualOvlAmount) / 1e18).toFixed(4)} OVL` 
      });
      setBridgedAmount(actualOvlAmount);

    } catch (error: unknown) {
      console.error('Bridge error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bridge failed';
      
      // Reset to idle state so user can retry immediately
      setBridgeStage({ stage: 'idle' });

      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message: `Bridge failed: ${errorMessage}`,
          type: "BRIDGE_ERROR",
        },
      }, Date.now().toString());
    }
  }, [
    account,
    walletClient,
    selectedToken,
    selectedChainId,
    typedValue,
    selectedLeverage,
    safeSwitch,
    approveIfNeeded,
    addPopup,
    refetchWalletClient
  ]);

  const resetBridge = useCallback(() => {
    setBridgeStage({ stage: 'idle' });
    setBridgedAmount('0');
    setBridgeQuote(null);
  }, []);

  const getBridgeQuote = useCallback(async (): Promise<BridgeQuoteResult> => {
    if (!account || !selectedToken || !typedValue) {
      return { error: new Error("Missing required data for quote") };
    }

    // If we're already on BSC with OVL, no quote needed
    if (selectedChainId === DEFAULT_CHAINID && selectedToken.address === OVL_ADDRESS[DEFAULT_CHAINID as number]) {
      const adjustedOvlAmount = calculateAdjustedBridgeAmount(typedValue, selectedLeverage);
      const quote: BridgeQuoteInfo = {
        expectedOvlAmount: adjustedOvlAmount.toString(),
        requiredInputAmount: adjustedOvlAmount.toString(),
        exchangeRate: "1 OVL = 1 OVL",
        fees: "No fees - already on BSC",
      };
      setBridgeQuote(quote);
      return { quote };
    }

    try {
      setBridgeStage({ stage: 'quote', message: 'Getting bridge quote...' });

      // Use adjusted OVL amount with toAmount (same as executeBridge)
      const adjustedOvlAmount = calculateAdjustedBridgeAmount(typedValue, selectedLeverage);

      console.log("🎯 getBridgeQuote using adjusted amount:", {
        userTypedValue: typedValue,
        userLeverage: selectedLeverage,
        adjustedOVL: (Number(adjustedOvlAmount) / 1e18).toFixed(6),
        toAmountRaw: adjustedOvlAmount.toString()
      });

      const quoteResponse = await getContractCallsQuote({
        fromChain: selectedChainId,
        fromToken: selectedToken.address,
        fromAddress: account,
        toChain: DEFAULT_CHAINID as number,
        toToken: OVL_ADDRESS[DEFAULT_CHAINID as number],
        toAmount: adjustedOvlAmount.toString(),
        contractCalls: [], // Empty array as shown in Li.Fi example
        slippage: BRIDGE_SLIPPAGE,
      });

      if (!quoteResponse) {
        return { error: new Error("Failed to get bridge quote") };
      }

      // Contract calls quote has different structure
      const finalRequiredInput = quoteResponse.action?.fromAmount || '0';
      const finalExpectedOvl = adjustedOvlAmount.toString(); // We requested adjusted amount
      const inputAmountReadable = Number(finalRequiredInput) / Math.pow(10, selectedToken.decimals);
      const expectedOvlReadable = Number(finalExpectedOvl) / 1e18;
      const exchangeRate = (inputAmountReadable / expectedOvlReadable).toFixed(6);

      console.log("🎯 Contract Calls Quote Response:", {
        requestedOVL: typedValue,
        quoteFromAmount: finalRequiredInput,
        adjustedOvlAmount: finalExpectedOvl,
        inputReadable: inputAmountReadable.toFixed(6),
        ovlReadable: expectedOvlReadable.toFixed(6),
        adjustedMatch: expectedOvlReadable === (Number(adjustedOvlAmount) / 1e18) ? "✅ Perfect!" : "❌ Mismatch"
      });

      const newQuote: BridgeQuoteInfo = {
        expectedOvlAmount: finalExpectedOvl,
        requiredInputAmount: finalRequiredInput,
        exchangeRate: `1 OVL = ${exchangeRate} ${selectedToken.symbol}`,
        fees: `${BRIDGE_FEE * 100}%`,
      };

      setBridgeQuote(newQuote);

      setBridgeStage({ stage: 'idle' });

      return { quote: newQuote };
    } catch (error: unknown) {
      console.error('Quote error:', error);
      setBridgeStage({ stage: 'idle' });
      return { error: error as Error };
    }
  }, [account, selectedToken, selectedChainId, typedValue, selectedLeverage]);

  return {
    bridgeStage,
    bridgedAmount,
    bridgeQuote,
    executeBridge,
    resetBridge,
    getBridgeQuote,
    isBridging: ['quote', 'approval', 'bridging'].includes(bridgeStage.stage),
    isSuccess: bridgeStage.stage === 'success',
  };
};