import { Box, Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import { InfoCardsGrid, MainCardsGrid } from "./overview-styles";
import OverviewCard from "./OverviewCard";
import useSDK from "../../../providers/SDKProvider/useSDK";
import useAccount from "../../../hooks/useAccount";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import MainOverviewCard from "./MainOverviewCard";
import OverviewChart from "./OverviewChart";
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
              unit="USDT"
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
              unit="USDT"
              isOver1000OpenPositions={isOver1000OpenPositions}
            />

            <OverviewCard
              title="Realized"
              isMultiValue={true}
              value={
                overviewData ? (
                  <Flex direction="column" gap="1" style={{ lineHeight: "1.2" }}>
                    {parseFloat(overviewData.realizedPnlUsdt) !== 0 && (
                      <>
                        <Text size="3" weight="bold">{overviewData.realizedPnlUsdt}</Text>
                        <Text style={{ fontSize: "14px" }}>USDT</Text>
                      </>
                    )}
                    {parseFloat(overviewData.realizedPnlOvl) !== 0 && (
                      <>
                        <Text size="3" weight="bold">{overviewData.realizedPnlOvl}</Text>
                        <Text style={{ fontSize: "14px" }}>OVL</Text>
                      </>
                    )}
                    {parseFloat(overviewData.realizedPnlUsdt) === 0 && parseFloat(overviewData.realizedPnlOvl) === 0 && (
                      <Text size="3" weight="bold">0</Text>
                    )}
                  </Flex>
                ) : undefined
              }
            />

            <OverviewCard
              title="Unrealized"
              value={overviewData?.unrealizedPnL}
              unit="USDT"
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
