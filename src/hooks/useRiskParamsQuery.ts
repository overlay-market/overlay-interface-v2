import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import useSDK from '../providers/SDKProvider/useSDK';
import { CHAIN_SUBGRAPH_URL } from '../constants/subgraph';

const document = gql`
  query RiskParams($marketId: String!) {
    markets(
      where: { id: $marketId }
      orderBy: totalVolume
      orderDirection: desc
    ) {
      id
      k
      lmbda
      delta
      capPayoff
      capNotional
      capLeverage
      circuitBreakerWindow
      circuitBreakerMintTarget
      maintenanceMarginFraction
      maintenanceMarginBurnRate
      liquidationFeeRate
      tradingFeeRate
      minCollateral
      priceDriftUpperLimit
      averageBlockTime
    }
  }
`;

type RiskParamsItem = {
  averageBlockTime: string;
  capLeverage: string;
  capNotional: string;
  capPayoff: string;
  circuitBreakerMintTarget: string;
  circuitBreakerWindow: string;
  delta: string;
  id: string;
  k: string;
  liquidationFeeRate: string;
  lmbda: string;
  maintenanceMarginBurnRate: string;
  maintenanceMarginFraction: string;
  minCollateral: string;
  priceDriftUpperLimit: string;
  tradingFeeRate: string;
};

type RiskParamsResponse = {
  markets: RiskParamsItem[];
};

export const useRiskParamsQuery = ({
  marketId,
}: {
  marketId?: string;
}) => {
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];

  if (!subgraphUrl) {
    throw new Error(`Subgraph URL not found for chain ID: ${sdk.core.chainId}`);
  }
  
  return useQuery<RiskParamsResponse>({
    queryKey: ['riskParams', marketId],
    queryFn: async () => {
      if (!marketId) throw new Error("Missing marketId");
      return await request(subgraphUrl, document, { marketId });
    },
    enabled: !!marketId,
  });
};