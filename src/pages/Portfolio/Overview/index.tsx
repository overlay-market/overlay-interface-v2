import { Box, Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { InfoCardsGrid, MainCardsGrid } from "./overview-styles";
import OverviewCard from "./OverviewCard";
import useSDK from "../../../providers/SDKProvider/useSDK";
import useAccount from "../../../hooks/useAccount";
import { Address } from "viem";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import MainOverviewCard from "./MainOverviewCard";
import OverviewChart from "./OverviewChart";
import { UNIT } from "../../../constants/applications";
import { IntervalType } from "overlay-sdk";
import usePrevious from "../../../hooks/usePrevious";
import { useIsNewUnwindTxn } from "../../../state/portfolio/hooks";
import { useOverviewDataRefresh } from "./hooks";

const Overview: React.FC = () => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();
  const isNewUnwindTxn = useIsNewUnwindTxn();

  const [selectedInterval, setSelectedInterval] = useState<IntervalType>("1M");
  const previousSelectedInterval = usePrevious(selectedInterval);

  const isNewSelectedInterval = useMemo(() => {
    return selectedInterval !== previousSelectedInterval;
  }, [selectedInterval, previousSelectedInterval]);

  const { overviewData, refreshOverviewData } = useOverviewDataRefresh(
    sdk,
    account as Address | undefined,
    selectedInterval,
    isNewTxnHash || isNewUnwindTxn || isNewSelectedInterval
  );

  const isOver1000OpenPositions = useMemo(() => {
    if (overviewData) {
      return Number(overviewData.numberOfOpenPositions) > 1000;
    } else return false;
  }, [account, overviewData, isNewTxnHash, isNewUnwindTxn]);

  useEffect(() => {
    setTimeout(refreshOverviewData, 1000);
  }, [isNewTxnHash, isNewUnwindTxn, isNewSelectedInterval]);

  return (
    <Flex
      direction="column"
      width={"100%"}
      gap={{ initial: "8px", md: "24px" }}
    >
      <Box py={"20px"}>
        <Text weight={"bold"} size={"5"}>
          Overview
        </Text>
      </Box>

      {account && (
        <>
          <MainCardsGrid>
            <OverviewChart
              selectedInterval={selectedInterval}
              handleSelectInterval={setSelectedInterval}
              chartData={overviewData?.dataByPeriod}
            />

            <MainOverviewCard
              title={"Locked Sum + uPnL"}
              value={overviewData?.lockedPlusUnrealized}
              unit={UNIT}
            />
          </MainCardsGrid>

          <InfoCardsGrid>
            <OverviewCard
              title="Open Positions"
              value={overviewData?.numberOfOpenPositions}
            />

            <OverviewCard
              title="Locked Sum"
              value={overviewData?.totalValueLocked}
              unit={UNIT}
              isOver1000OpenPositions={isOver1000OpenPositions}
            />

            <OverviewCard
              title="Realized"
              value={overviewData?.realizedPnl}
              unit={UNIT}
            />

            <OverviewCard
              title="Unrealized"
              value={overviewData?.unrealizedPnL}
              unit={UNIT}
              isOver1000OpenPositions={isOver1000OpenPositions}
            />
          </InfoCardsGrid>
        </>
      )}

      {!account && <Text>Nothing here yet. Connect the wallet.</Text>}
    </Flex>
  );
};

export default Overview;
