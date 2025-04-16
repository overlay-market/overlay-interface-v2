import { useState, useEffect } from 'react';

export interface PriceItem {
  address: string;
  price: number; 
}

interface UseTokenPricesResult {
  prices: PriceItem[];
  loading: boolean;
  error: Error | null;
}

export const useTokenPrices = (): UseTokenPricesResult => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://mainnet.api.oogabooga.io/v1/prices', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OOGA_BOOGA_API_KEY}`,
            Accept: '*/*',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const priceData: PriceItem[] = await response.json();

        // const filteredPrices = vaultsData
        //   .flatMap((vault) => [
        //     vault.token0.toLowerCase(),
        //     vault.token1.toLowerCase(),
        //   ])
        //   .map((address) =>
        //     priceData.find((item) => item.address.toLowerCase() === address)
        //   )
        //   .filter((price): price is PriceItem => price !== undefined);

        setPrices(priceData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []); 

  return { prices, loading, error };
};