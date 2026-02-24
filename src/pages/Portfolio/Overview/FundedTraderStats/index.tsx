import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import useAccount from "../../../../hooks/useAccount";
import { useFundedTraderStats } from "../../../../hooks/useFundedTraderStats";
import Loader from "../../../../components/Loader";
import EvaluationPhaseOverview from "./EvaluationPhaseOverview";

const FundedTraderStats: React.FC = () => {
  const { address, isAvatarTradingActive } = useAccount();
  const { data, isLoading, isError } = useFundedTraderStats(
    address,
    isAvatarTradingActive
  );

  // Funded phase stats are shown in the LimitBarsCard within the main grid
  if (!isAvatarTradingActive || isError || data?.phase === "funded") return null;

  return (
    <Flex direction="column" gap="8px">
      <Text weight="bold" size="5">
        Funded Trader
      </Text>

      {isLoading || !data ? (
        <Loader />
      ) : (
        <EvaluationPhaseOverview data={data} />
      )}
    </Flex>
  );
};

export default FundedTraderStats;
