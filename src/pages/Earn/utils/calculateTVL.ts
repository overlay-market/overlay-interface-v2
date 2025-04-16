import { formatUnits } from 'viem';
import { FetchedVaultData, PartialVault } from '../../../types/vaultTypes';
import { PriceItem } from '../hooks/useTokenPrices';
import { getTokenPrice } from './getTokenPrice';

export const calculateTVL = ({
  vault,
  fetchedVault,
  prices
}: {
  vault: PartialVault;
  fetchedVault: FetchedVaultData;
  prices: PriceItem[];
}): void => {
  const amount0 = parseFloat(formatUnits(fetchedVault.totalAmount0, 18));
  const amount1 = parseFloat(formatUnits(fetchedVault.totalAmount1, 18));
  const price0 = getTokenPrice(prices, fetchedVault.token0);
  const price1 = getTokenPrice(prices, fetchedVault.token1);
 
  const tvl = amount0 * price0 + amount1 * price1;

  vault.tvl = tvl.toString()
}