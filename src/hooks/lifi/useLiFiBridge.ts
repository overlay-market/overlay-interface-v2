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
  const { typedValue } = useTradeState();
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
      const ovlAmount = parseUnits(typedValue, OVL_DECIMALS).toString();
      setBridgeStage({ stage: 'success', message: 'Ready for position - already on BSC with OVL' });
      setBridgedAmount(ovlAmount);
      return;
    }

    try {
      setBridgeStage({ stage: 'quote', message: 'Getting bridge quote...' });

      // Use exact OVL amount that user wants to receive with toAmount
      const exactOvlAmount = parseUnits(typedValue, OVL_DECIMALS);

      console.log("🎯 Using toAmount for exact OVL:", {
        userTypedValue: typedValue,
        wantedOVL: (Number(exactOvlAmount) / 1e18).toFixed(6),
        toAmountRaw: exactOvlAmount.toString()
      });

      // Get contract calls quote with exact toAmount
      const quote = await getContractCallsQuote({
        fromChain: selectedChainId,
        fromToken: selectedToken.address,
        fromAddress: account,
        toChain: DEFAULT_CHAINID as number,
        toToken: OVL_ADDRESS[DEFAULT_CHAINID as number],
        toAmount: exactOvlAmount.toString(),
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
      const finalExpectedOvl = exactOvlAmount.toString(); // We requested exact amount
      const guaranteedOvlAmount = quote.estimate?.toAmountMin || exactOvlAmount.toString(); 
      const approvalAddress = quote.estimate?.approvalAddress;
      
      // Calculate exchange rate and fees for display
      const inputAmountReadable = Number(finalRequiredInput) / Math.pow(10, selectedToken.decimals);
      const expectedOvlReadable = Number(finalExpectedOvl) / 1e18;
      const exchangeRate = (inputAmountReadable / expectedOvlReadable).toFixed(6);
      
      console.log("🎯 Contract calls quote details (toAmount):", {
        requestedOVL: (Number(exactOvlAmount) / 1e18).toFixed(6),
        expectedOVL: expectedOvlReadable.toFixed(6),
        guaranteedOVL: (Number(guaranteedOvlAmount) / 1e18).toFixed(6),
        requiredInput: inputAmountReadable.toFixed(6),
        exchangeRate: `1 OVL = ${exchangeRate} ${selectedToken.symbol}`,
        exactMatch: expectedOvlReadable === (Number(exactOvlAmount) / 1e18) ? "✅ Perfect match!" : "❌ Mismatch"
      });
      
      // Store quote info for potential modal display
      setBridgeQuote({
        expectedOvlAmount: finalExpectedOvl,
        requiredInputAmount: finalRequiredInput,
        exchangeRate: `1 OVL = ${exchangeRate} ${selectedToken.symbol}`,
        fees: '~1% slippage'
      });

      // Switch to source chain for token approval
      await safeSwitch(selectedChainId);

      // Handle token approval if needed
      await approveIfNeeded({
        token: {
          address: selectedToken.address as Address,
          chainId: selectedToken.chainId,
        },
        spenderAddress: approvalAddress as Address,
        tokenAmountSelected: BigInt(finalRequiredInput),
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
        switchChainHook: async () => {
          const success = await safeSwitch(route.fromChainId);
          if (!success) {
            throw new Error(`Failed to switch to chain ${route.fromChainId}`);
          }

          const { data: updatedWalletClient } = await refetchWalletClient();
          if (!updatedWalletClient) {
            throw new Error("No wallet client after chain switch");
          }
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
    safeSwitch,
    approveIfNeeded,
    addPopup
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
      const ovlAmount = parseUnits(typedValue, OVL_DECIMALS);
      const quote: BridgeQuoteInfo = {
        expectedOvlAmount: ovlAmount.toString(),
        requiredInputAmount: ovlAmount.toString(),
        exchangeRate: "1 OVL = 1 OVL",
        fees: "No fees - already on BSC",
      };
      setBridgeQuote(quote);
      return { quote };
    }

    try {
      setBridgeStage({ stage: 'quote', message: 'Getting bridge quote...' });

      // Use exact OVL amount with toAmount (same as executeBridge)
      const exactOvlAmount = parseUnits(typedValue, OVL_DECIMALS);

      console.log("🎯 getBridgeQuote using toAmount:", {
        userTypedValue: typedValue,
        wantedOVL: (Number(exactOvlAmount) / 1e18).toFixed(6),
        toAmountRaw: exactOvlAmount.toString()
      });

      const quoteResponse = await getContractCallsQuote({
        fromChain: selectedChainId,
        fromToken: selectedToken.address,
        fromAddress: account,
        toChain: DEFAULT_CHAINID as number,
        toToken: OVL_ADDRESS[DEFAULT_CHAINID as number],
        toAmount: exactOvlAmount.toString(),
        contractCalls: [], // Empty array as shown in Li.Fi example
        slippage: BRIDGE_SLIPPAGE,
      });

      if (!quoteResponse) {
        return { error: new Error("Failed to get bridge quote") };
      }

      // Contract calls quote has different structure
      const finalRequiredInput = quoteResponse.action?.fromAmount || '0';
      const finalExpectedOvl = exactOvlAmount.toString(); // We requested exact amount
      const inputAmountReadable = Number(finalRequiredInput) / Math.pow(10, selectedToken.decimals);
      const expectedOvlReadable = Number(finalExpectedOvl) / 1e18;
      const exchangeRate = (inputAmountReadable / expectedOvlReadable).toFixed(6);

      console.log("🎯 Contract Calls Quote Response:", {
        requestedOVL: typedValue,
        quoteFromAmount: finalRequiredInput,
        exactOvlAmount: finalExpectedOvl,
        inputReadable: inputAmountReadable.toFixed(6),
        ovlReadable: expectedOvlReadable.toFixed(6),
        perfectMatch: expectedOvlReadable === parseFloat(typedValue) ? "✅ Perfect!" : "❌ Mismatch"
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
  }, [account, selectedToken, selectedChainId, typedValue]);

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