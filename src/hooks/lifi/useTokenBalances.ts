import { useQuery } from '@tanstack/react-query';
import { useChainAndTokenState } from '../../state/trade/hooks';
import useTokensByChain from './useTokensByChain';
import useAccount from '../useAccount';
import { getTokenBalances, TokenAmount } from '@lifi/sdk';
import { formatUnits } from 'viem';

const defaultRefetchInterval = 32_000

const useTokenBalances = () => {
  const { selectedChainId } = useChainAndTokenState();
  const {address} = useAccount();

  const { tokens, chain, isLoading } = useTokensByChain();

  const isBalanceLoadingEnabled =
    Boolean(address) &&
    Boolean(tokens?.length) &&
    Boolean(selectedChainId)

  const {
    data: result,
    isLoading: isBalanceLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'token-balances',
      address,
      selectedChainId,
      tokens?.length,
    ],
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      const balances: TokenAmount[] = await getTokenBalances(
        accountAddress as string,
        tokens!
      )

      if (!balances?.length) {
        return {
          allTokenBalances: tokens as TokenAmount[],
          tokensWithBalance: [],
        }
      }

      const sortFn = (a: TokenAmount, b: TokenAmount) =>
        Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
          Number.parseFloat(b.priceUSD ?? '0') -
        Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
          Number.parseFloat(a.priceUSD ?? '0')

      const tokensWithBalance: TokenAmount[] = [];
      const tokensWithoutBalance: TokenAmount[] = [];

      balances.forEach((token) => {        
        if (token.amount && token.amount > 0n) {
          tokensWithBalance.push(token);
        } else {
          tokensWithoutBalance.push(token);
        }
      });
      
      tokensWithBalance.sort(sortFn)

      return {
        allTokenBalances: [...tokensWithBalance, ...tokensWithoutBalance],
        tokensWithBalance,
      }
    },
    enabled: isBalanceLoadingEnabled,
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  })

  return {
    tokens,
    allTokenBalances: result?.allTokenBalances ?? [],
    tokensWithBalance: result?.tokensWithBalance ?? [],
    chain,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    refetch,
  }
};

export default useTokenBalances;