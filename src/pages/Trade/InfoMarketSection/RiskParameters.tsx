import { Flex, Text } from "@radix-ui/themes";
import React, { useMemo } from "react";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import {
  RiskParamsItem,
  RiskParamsTable,
  RiskParamsTablesContainer,
} from "./risk-parameters-styles";
import theme from "../../../theme";
import { useRiskParamsQuery } from "../../../hooks/useRiskParamsQuery";
import { formatFixedPoint18 } from "../../../utils/formatFixedPoint18";

const RiskParameters: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { data } = useRiskParamsQuery({
    marketId: currentMarket?.id,
  });

  const riskParamsData = data?.markets ?? null;

  const averageBlockTime = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return riskParamsData[0].averageBlockTime;
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const capLeverage = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].capLeverage);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const capNotional = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].capNotional);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const capPayoff = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].capPayoff);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const circuitBreakerMintTarget = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].circuitBreakerMintTarget);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const circuitBreakerWindow = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return Number(riskParamsData[0].circuitBreakerWindow)
        .toLocaleString("en-US")
        .replaceAll(",", " ");
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const delta = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].delta);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const k = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return Number(formatFixedPoint18(riskParamsData[0].k)).toExponential();
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const liquidationFeeRate = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].liquidationFeeRate);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const lmbda = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].lmbda);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const maintenanceMarginBurnRate = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].maintenanceMarginBurnRate);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const maintenanceMarginFraction = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].maintenanceMarginFraction);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const minCollateral = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].minCollateral);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const priceDriftUpperLimit = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].priceDriftUpperLimit);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const tradingFeeRate = useMemo(() => {
    if (riskParamsData && riskParamsData.length > 0) {
      return formatFixedPoint18(riskParamsData[0].tradingFeeRate);
    } else {
      return "-";
    }
  }, [riskParamsData]);

  const TABLE1: Array<Record<string, string>> = [
    { k: k },
    { lmbda: lmbda },
    { delta: delta },
    { capPayoff: capPayoff },
    { capNotional: capNotional },
  ];

  const TABLE2: Array<Record<string, string>> = [
    { capLeverage: capLeverage },
    { liquidationFeeRate: liquidationFeeRate },
    { tradingFeeRate: tradingFeeRate },
    { minCollateral: minCollateral },
    { averageBlockTime: averageBlockTime },
  ];

  const TABLE3: Array<Record<string, string>> = [
    { priceDriftUpperLimit: priceDriftUpperLimit },
    { circuitBreakerWindow: circuitBreakerWindow },
    { circuitBreakerMintTarget: circuitBreakerMintTarget },
    { maintenanceMarginFraction: maintenanceMarginFraction },
    { maintenanceMarginBurnRate: maintenanceMarginBurnRate },
  ];

  return (
    <Flex
      direction={"column"}
      gap={"24px"}
      py={{ initial: "16px", sm: "32px" }}
      width={"100%"}
    >
      {!isMobile && (
        <Text size={"3"} weight={"bold"}>
          Risk Parameters
        </Text>
      )}

      <RiskParamsTablesContainer>
        {[TABLE1, TABLE2, TABLE3].map((table, tableIndex) => (
          <RiskParamsTable key={`table-${tableIndex}`}>
            {table.map((record, recordIndex) => {
              const entries = Object.entries(record);
              const label = entries[0][0];
              const value = entries[0][1];

              return (
                <RiskParamsItem key={`record-${tableIndex}-${recordIndex}`}>
                  <Text weight={"bold"} style={{ color: theme.color.grey3 }}>
                    {label}
                  </Text>
                  <Text weight={"medium"}>{value}</Text>
                </RiskParamsItem>
              );
            })}
          </RiskParamsTable>
        ))}
      </RiskParamsTablesContainer>
    </Flex>
  );
};

export default RiskParameters;
