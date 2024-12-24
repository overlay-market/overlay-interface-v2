import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { CHAIN_SUBGRAPH_URL } from "../../../constants/subgraph";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { gql, request } from "graphql-request";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

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

type RiskParamsData = RiskParamsItem[];

type RiskParamsResponse = {
  markets: RiskParamsData;
};

const RiskParameters: React.FC = () => {
  const sdk = useSDK();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[sdk.core.chainId];
  const { currentMarket } = useCurrentMarketState();

  const [riskParamsData, setRiskParamsData] = useState<RiskParamsData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (currentMarket) {
        try {
          const data: RiskParamsResponse = await request(
            subgraphUrl,
            document,
            {
              marketId: currentMarket.id,
            }
          );
          setRiskParamsData(data.markets);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [currentMarket]);

  const formatAndTransform = (value: string) => {
    if (value.trim() === "") return "-";

    const bigIntValue = BigInt(value);
    const divisor = BigInt(1e18);
    const precision = BigInt(1e10);

    const scaledValue = (bigIntValue * precision) / divisor;

    return (Number(scaledValue) / 1e10)
      .toLocaleString("en-US", {
        maximumFractionDigits: 10,
      })
      .replaceAll(",", " ");
  };

  const averageBlockTime = useMemo(() => {
    if (riskParamsData) {
      return riskParamsData[0].averageBlockTime;
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const capLeverage = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].capLeverage);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const capNotional = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].capNotional);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const capPayoff = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].capPayoff);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const circuitBreakerMintTarget = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].circuitBreakerMintTarget);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const circuitBreakerWindow = useMemo(() => {
    if (riskParamsData) {
      return Number(riskParamsData[0].circuitBreakerWindow)
        .toLocaleString("en-US")
        .replaceAll(",", " ");
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const delta = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].delta);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const k = useMemo(() => {
    if (riskParamsData) {
      return Number(formatAndTransform(riskParamsData[0].k)).toExponential();
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const liquidationFeeRate = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].liquidationFeeRate);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const lmbda = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].lmbda);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const maintenanceMarginBurnRate = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].maintenanceMarginBurnRate);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const maintenanceMarginFraction = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].maintenanceMarginFraction);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const minCollateral = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].minCollateral);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const priceDriftUpperLimit = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].priceDriftUpperLimit);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const tradingFeeRate = useMemo(() => {
    if (riskParamsData) {
      return formatAndTransform(riskParamsData[0].tradingFeeRate);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  return (
    <Flex direction={"column"} gap={"6px"}>
      <Text>{averageBlockTime}</Text>
      <Text>{capLeverage}</Text>
      <Text>{capNotional}</Text>
      <Text>{capPayoff}</Text>
      <Text>{circuitBreakerMintTarget}</Text>
      <Text>{circuitBreakerWindow}</Text>
      <Text>{delta}</Text>
      <Text>{k}</Text>
      <Text>{liquidationFeeRate}</Text>
      <Text>{lmbda}</Text>
      <Text>{maintenanceMarginBurnRate}</Text>
      <Text>{maintenanceMarginFraction}</Text>
      <Text>{minCollateral}</Text>
      <Text>{priceDriftUpperLimit}</Text>
      <Text>{tradingFeeRate}</Text>
    </Flex>
  );
};

export default RiskParameters;
