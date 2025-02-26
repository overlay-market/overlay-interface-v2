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
import { IntervalType, OverviewData } from "overlay-sdk";
import usePrevious from "../../../hooks/usePrevious";

const Overview: React.FC = () => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const [overviewData, setOverviewData] = useState<OverviewData | undefined>(
    undefined
  );
  const [selectedInterval, setSelectedInterval] = useState<IntervalType>("1M");
  const previousSelectedInterval = usePrevious(selectedInterval);

  const isNewSelectedInterval = useMemo(() => {
    return selectedInterval !== previousSelectedInterval;
  }, [selectedInterval, previousSelectedInterval]);

  useEffect(() => {
    const fetchOverviewDetails = async () => {
      if (account) {
        try {
          const overviewData = await sdk.accountDetails.getOverview(
            selectedInterval,
            account as Address,
            isNewTxnHash || isNewSelectedInterval
          );
          overviewData && setOverviewData(overviewData);
        } catch (error) {
          console.error("Error fetching overview details:", error);
        }
      }
    };

    fetchOverviewDetails();
  }, [account, isNewTxnHash, selectedInterval, isNewSelectedInterval]);

  const isOver1000OpenPositions = useMemo(() => {
    if (overviewData) {
      return Number(overviewData.numberOfOpenPositions) > 1000;
    } else return false;
  }, [account, isNewTxnHash]);

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
