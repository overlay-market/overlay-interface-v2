import { useEffect, useMemo, useState } from "react";
import { gql, request } from "graphql-request";
import { BERA_VAULTS_SUBGRAPH_URL, vaultItemsById } from "../../../constants/vaults";
import { Address, formatUnits, parseUnits } from "viem";
import { getTokenSymbol } from "../utils/getTokenSymbol";
import { getTokenPrice } from "../utils/getTokenPrice";
import { useTokenPrices } from "./useTokenPrices";
import { UserCurrentBalance } from "../../../types/vaultTypes";
// import useAccount from "../../../hooks/useAccount";

const document = gql`
  query MyQuery($userId: String!, $vaultId: String!) {
    user(id: $userId) {
      id
      vaultShares(where: { vault_: { id: $vaultId } }) {
        vaultShareBalance
        vault {
          id
          totalSupply
          totalAmount0
          totalAmount1
          decimals0
          decimals1
          token0
          token1
        }
      }
    }
  }
`;

export const useUserCurrentBalance = (vaultId: number) => {
  // const { address: account } = useAccount();
  const account = `0x1D5b02978d14F9111A685D746d3e360d9e33A541`;

  const { prices, loading: pricesLoading, error: pricesError } = useTokenPrices();

  const [curBalance, setCurBalance] = useState<UserCurrentBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (pricesLoading || pricesError || !prices || !account) return;

    const fetchUserCurrentBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const userVaultShares = await request<{
          user: {
            id: string;
            vaultShares: Array<{
              vaultShareBalance: string;
              vault: {
                id: string;
                totalSupply: string;
                totalAmount0: string;
                totalAmount1: string;
                decimals0: number;
                decimals1: number;
                token0: string;
                token1: string;
              };
            }>;
          } | null;
        }>(
          BERA_VAULTS_SUBGRAPH_URL,
          document,
          { userId: account.toLowerCase(),
            vaultId: vaultItemsById[vaultId].vaultAddress.toLowerCase() 
          }
        );

        const vaultShare = userVaultShares.user?.vaultShares[0];
        
        let userTokensBalance: UserCurrentBalance[] = [];
        
        if (vaultShare) {
          const userBalanceBN = parseUnits(vaultShare.vaultShareBalance, 18); 
          const totalSupplyBN = BigInt(vaultShare.vault.totalSupply);
          const totalAmountsBN = [
            BigInt(vaultShare.vault.totalAmount0),
            BigInt(vaultShare.vault.totalAmount1),
          ];
        
          const userAmountsBN = {
            amount0: userBalanceBN * totalAmountsBN[0] / totalSupplyBN,
            amount1: userBalanceBN * totalAmountsBN[1] / totalSupplyBN,
          };
        
          const userAmounts = {
            amount0: formatUnits(userAmountsBN.amount0, vaultShare.vault.decimals0),
            amount1: formatUnits(userAmountsBN.amount1, vaultShare.vault.decimals1),
          };
        
          const token0 = vaultShare.vault.token0 as Address;
          const token1 = vaultShare.vault.token1 as Address;
          const [token0Symbol, token1Symbol] = await Promise.all([
            getTokenSymbol(token0),
            getTokenSymbol(token1),
          ]);
        
          const price0 = getTokenPrice(prices, token0);
          const price1 = getTokenPrice(prices, token1);
        
          userTokensBalance = [
            {
              tokenSymbol: token0Symbol,
              amount: userAmounts.amount0,
              tokenValue: Number(userAmounts.amount0) * price0,
            },
            {
              tokenSymbol: token1Symbol,
              amount: userAmounts.amount1,
              tokenValue: Number(userAmounts.amount1) * price1,
            },
          ].filter(
            (t): t is typeof t & UserCurrentBalance =>
              !!t.tokenSymbol && !!t.amount && !isNaN(t.tokenValue)
          );
        }
        setCurBalance(userTokensBalance);
      } catch (err) {
        console.error('Failed to fetch vaults data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserCurrentBalance();
  }, [pricesLoading, prices, account, vaultId]); 

  const result = useMemo(() => {
    return { curBalance, loading, error };
  }, [curBalance, loading, error]);

  return result;
  
};