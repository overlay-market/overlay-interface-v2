import  { useState, useCallback } from 'react';
import { Address, Hex } from 'viem';
import { useAccount,  usePublicClient,  useWalletClient } from 'wagmi';
import { OVL_ADDRESS, toWei } from 'overlay-sdk';
import { useChainAndTokenState, useTradeState } from '../../state/trade/hooks';
import { calculateTokenAmountFromOvlAmount } from '../../utils/lifi/tokenOvlConversion';
import { DEFAULT_TOKEN, OVL_USD_PRICE, SHIVA_ADDRESS } from '../../constants/applications';
import { convertQuoteToRoute, executeRoute, ExecutionOptions, getContractCallsQuote, getQuote } from '@lifi/sdk';
import { BuildOnBehalfOfParams, useShivaBuild } from './useShivaBuild';
import { useCurrentMarketState } from '../../state/currentMarket/hooks';
import useSDK from '../../providers/SDKProvider/useSDK';
import { DEFAULT_CHAINID } from '../../constants/chains';
import { useTokenApprovalWithLiFi } from './useTokenApprovalWithLiFi';
import { useSafeChainSwitch } from './useSafeChainSwitch';
import { useAddPopup } from '../../state/application/hooks';

interface TradeParams {
  priceLimit: bigint;
}
interface LiFiQuoteRequest {
  fromChain: number;
  fromToken: string;
  fromAddress: string;
  fromAmount: string;
  toChain: number;
  toToken: string;
  slippage: number;
  contractCalls: Array<{
    fromAmount: string;
    fromTokenAddress: string;
    toContractAddress: string;
    toContractCallData: string;
    toContractGasLimit: string;
  }>;
}

export interface TradeStage {
  stage: 'idle' | 'quote' | 'approval' | 'signing' | 'pending' | 'success' | 'error';
  message?: string;
  txHash?: string;
  error?: string;
}

export const useLiFiTrade = () => {
  const [tradeStage, setTradeStage] = useState<TradeStage>({ stage: 'idle' });
  const [quote, setQuote] = useState<any>(null);
  
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { typedValue, selectedLeverage, isLong } = useTradeState();
  const {selectedChainId, selectedToken} = useChainAndTokenState();
  const { currentMarket } = useCurrentMarketState();
  const sdk = useSDK();
  const {encodeShivaBuildCall} = useShivaBuild();
  const { approveIfNeeded } = useTokenApprovalWithLiFi({setTradeStage});
  const addPopup = useAddPopup();

  const { safeSwitch } = useSafeChainSwitch({
    onSwitchStart: (from, to) =>
      setTradeStage({ stage: 'pending', message: `Switching from chain ${from} to ${to}` }),
  });
   
  // Execute Li.Fi trade
  const executeLiFiTrade = useCallback(async (params: TradeParams) => {
    if (!account || !publicClient || !walletClient) {
      throw new Error('Wallet not connected');
    }

    if (!currentMarket) {
      console.warn('Missing required data for Trade with LiFi action');
      return;
    }  

    try {        
      await safeSwitch(selectedChainId);

      setTradeStage({ stage: 'quote', message: 'Getting cross-chain quote estimation' });     

      const tokenAmount = calculateTokenAmountFromOvlAmount(typedValue, selectedToken, OVL_USD_PRICE);     
                
      const estimateQuote = await getQuote({
        fromChain: selectedChainId,
        fromToken: selectedToken.address,
        fromAddress: account,
        fromAmount: tokenAmount.toString(),
        toChain: DEFAULT_CHAINID as number, 
        toToken: OVL_ADDRESS[DEFAULT_CHAINID as number], 
        slippage: 0.03,
      }).catch((err) => {
        console.error("❌ Failed to get estimate quote:", err);
        throw new Error(
          `Failed to get Ovl estimate: ${err.message || "Unknown error"}`
        );
      });

      if (!estimateQuote || !estimateQuote.estimate) {
        throw new Error("Failed to get OVL amount estimate");
      }

      const estimatedOvlAmount = estimateQuote.estimate.toAmount;
      const approvalAddress = estimateQuote.estimate.approvalAddress;

      // Handle selected token approval if needed
      await approveIfNeeded({
        token: {
          address: selectedToken.address as Address,
          chainId: selectedToken.chainId,
        },
        spenderAddress: approvalAddress as Address,
        tokenAmountSelected: tokenAmount,
      });

      const shivaBuildParams: BuildOnBehalfOfParams = {
        marketAddress: currentMarket.id as Address,
        brokerId: sdk.core.brokerId || 0,
        isLong: isLong,
        collateral: BigInt(estimatedOvlAmount),
        leverage: toWei(selectedLeverage),
        priceLimit: params.priceLimit,
        owner: account,
        deadline: Math.floor(Date.now() / 1000) + 1800,
      };
      
      await safeSwitch(DEFAULT_CHAINID as number); 

      setTradeStage({ stage: 'signing', message: 'Please sign the transaction' });  

      const encodedShivaBuildCallData: Hex = await encodeShivaBuildCall(shivaBuildParams);
  
      const estimatedGas = await publicClient.estimateGas({
        account,
        to: currentMarket.id as Address,
        data: encodedShivaBuildCallData,
        value: 0n,
      });

      const gasWithBuffer = estimatedGas * 11n / 10n;

      setTradeStage({ stage: 'quote', message: 'Getting cross-chain quote request' });  

      // Create Li.Fi quote request
      const lifiQuoteRequest: LiFiQuoteRequest = {
        fromChain: selectedChainId,
        fromToken: selectedToken.address,
        fromAddress: account,
        fromAmount: tokenAmount.toString(),
        toChain: DEFAULT_CHAINID as number,
        toToken: OVL_ADDRESS[DEFAULT_CHAINID as number], 
        slippage: 0.03,
        contractCalls: [
          {
            fromAmount: estimatedOvlAmount.toString(), 
            fromTokenAddress: OVL_ADDRESS[DEFAULT_CHAINID as number],
            toContractAddress: currentMarket.id as Address,
            toContractCallData: encodedShivaBuildCallData,
            toContractGasLimit: gasWithBuffer.toString() || '500000',
          },
        ],
      };

      // Get quote from Li.Fi
      const quoteData = await getContractCallsQuote(
        lifiQuoteRequest
      ).catch((err) => {
        console.error("❌ Li.Fi getContractCallsQuote failed:", err);
        
        throw new Error(
          `Failed to get quote: ${err.message || "Unknown error"}`
        );
      });

      if (!quoteData || !quoteData.estimate) {
        console.error("❌ Invalid quote response:", quoteData);
        throw new Error(
          "Received invalid quote from Li.Fi. Missing required data."
        );
      }

      setQuote(quoteData);

      setTradeStage({ 
        stage: 'quote', 
        message: `Quote received.` 
      });

      // Handle ovl token approval if needed
      await approveIfNeeded({
        token: {
          address: DEFAULT_TOKEN.address as Address,
          chainId: DEFAULT_TOKEN.chainId as number,
        },
        spenderAddress: SHIVA_ADDRESS[DEFAULT_CHAINID as number] as Address,
        tokenAmountSelected: BigInt(estimatedOvlAmount),
      });      

      // Convert quote to route
      const route = convertQuoteToRoute(quote);

      const shownTxHashes = new Set<string>();
      
    const executedRoute = await executeRoute(route, {
      // Update hook to track progress and set transaction hash
      updateRouteHook: (updatedRoute) => {
        console.log("🔄 Route updated:", {
          routeId: updatedRoute.id,
          steps: updatedRoute.steps.length,
          status: updatedRoute.steps.map((s) => ({
            tool: s.tool,
            type: s.type,
            // action: s.action?.type || "unknown",
            status: s.execution?.status,
            txHash: s.execution?.process?.[0]?.txHash,
            fromToken: s.action?.fromToken?.symbol,
            toToken: s.action?.toToken?.symbol,
            fromChain: s.action?.fromChainId,
            toChain: s.action?.toChainId,
            includedSteps: s.includedSteps?.length || 0,
            // Include contract call details if present
            // hasContractCalls: Boolean(s.action?.contractCall),
          })),
        });
        
        for (const step of updatedRoute.steps) {
          const txHash = step.execution?.process?.[0]?.txHash;
          if (txHash && !shownTxHashes.has(txHash)) {
            shownTxHashes.add(txHash);
            addPopup(
              {
                txn: {
                  hash: txHash,
                  success: true,
                  message: "Transaction successfully executed",
                  type: "Trade with LiFi",
                },
              },
              txHash
            );
          }
        }
        
      },
      // Let the user accept exchange rate updates
      acceptExchangeRateUpdateHook: async () => {
        // Auto-accept any rate changes for this demo
        return true;
      },
    } as ExecutionOptions);

    } catch (error: any) {
      console.error('Li.Fi trade error:', error);
      setTradeStage({ 
        stage: 'error', 
        error: error.message || 'Trade failed',
        message: 'Trade failed. Please try again.' 
      });

      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message: `Trade failed. Please try again.`,
          type: "TRADE_ERROR",
        },
      }, Date.now().toString());
    }
  }, [account, 
    publicClient, 
    walletClient, 
    currentMarket, 
    selectedChainId, 
    typedValue, 
    selectedToken, 
    sdk.core.brokerId, 
    isLong, 
    selectedLeverage, 
    ]);

  // Reset trade state
  const resetTradeWithLiFi = useCallback(() => {
    setTradeStage({ stage: 'idle' });
    setQuote(null);
  }, []);

  return {
    tradeStage,
    quote,
    executeLiFiTrade,
    resetTradeWithLiFi,
    isLoading: ['quote', 'approval', 'signing', 'pending'].includes(tradeStage.stage),
    isSuccess: tradeStage.stage === 'success',
    isError: tradeStage.stage === 'error',
  };
};