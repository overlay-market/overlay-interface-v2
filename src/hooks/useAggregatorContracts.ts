import { useQuery } from "@tanstack/react-query";
import { DATA_API_BASE_URL } from "../constants/applications";

export interface AggregatorContractTicker {
  ticker_id: string;
  contract_type: "vanilla";
  contract_price_currency: string;
  contract_price?: number;
  base_currency: string;
  target_currency: string;
  last_price: number;
  base_volume: number;
  target_volume: number;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
  product_type: string;
  open_interest: number;
  open_interest_usd: number;
  index_price: number;
  index_name?: string;
  index_currency: string;
  start_timestamp: number;
  end_timestamp: number;
  funding_rate: number;
  next_funding_rate: number;
  next_funding_rate_timestamp: number;
}

const fetchAggregatorContracts = async (): Promise<AggregatorContractTicker[]> => {
  const response = await fetch(`${DATA_API_BASE_URL}/aggregator/contracts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch aggregator contracts: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid aggregator contracts response");
  }

  return data as AggregatorContractTicker[];
};

export const useAggregatorContracts = () => {
  return useQuery({
    queryKey: ["aggregatorContracts"],
    queryFn: fetchAggregatorContracts,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
};
