import { IntervalType, OpenPositionData, OverlaySDK, OverviewData } from "overlay-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import usePrevious from "../../../hooks/usePrevious";
import { useIsNewUnwindTxn } from "../../../state/portfolio/hooks";
import { Address } from "viem";
import useAccount from "../../../hooks/useAccount";
import { isShutdownOpenPosition } from "../../../utils/positionGuards";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const POLLING_INTERVAL = 5000;
const MAX_POLLING_TIME = 60000;

const WAD = 1e18;

const calculateOverviewTotals = (
  positions: OpenPositionData[],
  oraclePrice?: bigint
) => {
  let totalValueLocked = 0;
  let unrealizedPnL = 0;

  positions.forEach((position) => {
    if (isShutdownOpenPosition(position)) {
      return;
    }

    if (position.stableValues) {
      totalValueLocked += position.stableValues.initialCollateral
        ? parseFloat(position.stableValues.initialCollateral)
        : 0;
      unrealizedPnL += position.stableValues.unrealizedPnL
        ? parseFloat(position.stableValues.unrealizedPnL)
        : 0;
      return;
    }

    if (!oraclePrice) {
      return;
    }

    const initialCollateralOvl = position.initialCollateral
      ? parseFloat(String(position.initialCollateral))
      : 0;
    const pnlOvl = position.unrealizedPnL
      ? parseFloat(String(position.unrealizedPnL))
      : 0;

    totalValueLocked += (initialCollateralOvl * Number(oraclePrice)) / WAD;
    unrealizedPnL += (pnlOvl * Number(oraclePrice)) / WAD;
  });

  return {
    totalValueLocked: totalValueLocked.toFixed(2),
    unrealizedPnL: unrealizedPnL.toFixed(2),
    lockedPlusUnrealized: (totalValueLocked + unrealizedPnL).toFixed(2),
  };
};

export function useOverviewDataRefresh(
  sdk: OverlaySDK,
  selectedInterval: IntervalType,
  refreshData: boolean,
) {
  const { address: account } = useAccount();
  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<OverviewData | undefined>(
    undefined
  );
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isNewUnwindTxn = useIsNewUnwindTxn();
  const previousOverviewData = usePrevious(overviewData);

  const sdkRef = useRef(sdk);
  const fetchVersionRef = useRef(0);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const areOverviewDataEqual = (
    obj1: OverviewData | undefined,
    obj2: OverviewData | undefined
  ): boolean => {
    if (!obj1 || !obj2) return false;
    if (obj1 === obj2) return true;
  
    return (
      obj1.numberOfOpenPositions === obj2.numberOfOpenPositions &&
      obj1.realizedPnl === obj2.realizedPnl &&
      obj1.totalValueLocked === obj2.totalValueLocked &&
      obj1.unrealizedPnL === obj2.unrealizedPnL &&
      obj1.lockedPlusUnrealized === obj2.lockedPlusUnrealized
    );
  };

  const fetchOverviewDetails = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      if (!account) {
        return false;
      }

      const thisVersion = retryCount === 0
        ? ++fetchVersionRef.current
        : fetchVersionRef.current;

      try {
        const result = await sdkRef.current.accountDetails.getOverview(
          selectedInterval,
          account as Address,
          refreshData
        );

        if (thisVersion !== fetchVersionRef.current) return false;

        if (!result) {
          throw new Error("No overview data received");
        }

        let nextOverviewData = result;

        try {
          const [openPositionsResult, oraclePrice] = await Promise.all([
            sdkRef.current.openPositions.transformOpenPositions(
              1,
              1000,
              undefined,
              account as Address,
              refreshData
            ),
            sdkRef.current.lbsc.getOraclePrice().catch(() => undefined),
          ]);

          nextOverviewData = {
            ...result,
            ...calculateOverviewTotals(openPositionsResult.data, oraclePrice),
          };
        } catch (correctionError) {
          console.error("Error correcting overview totals:", correctionError);
        }

        const hasNewData =
          !areOverviewDataEqual(nextOverviewData, previousOverviewData) &&
          Boolean(nextOverviewData);
        setOverviewData(nextOverviewData);
        return hasNewData;
      } catch (error) {
        if (thisVersion !== fetchVersionRef.current) return false;

        console.error(
          `Error fetching overview data(attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          if (thisVersion !== fetchVersionRef.current) return false;
          return fetchOverviewDetails(retryCount + 1);
        } else {
          console.warn("Max retries reached. Keeping previous overviewData.");
          return false;
        }
      }
    },
    [
      account,
      refreshData,
      isNewUnwindTxn,
      selectedInterval
    ]
  );

  const startPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    startTimeRef.current = Date.now();

    const poll = async () => {
      const hasNewData = await fetchOverviewDetails();
      const elapsedTime = Date.now() - (startTimeRef.current || 0);

      if (hasNewData || elapsedTime >= MAX_POLLING_TIME) {
        setIsUpdating(false);
        return;
      }

      pollingTimeoutRef.current = setTimeout(poll, POLLING_INTERVAL);
    };

    poll();
  }, [fetchOverviewDetails]);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      setLoading(true);
      await fetchOverviewDetails();
      if (!isMounted) return;
      setLoading(false);
    };

    refresh();

    return () => {
      isMounted = false;
    };
  }, [fetchOverviewDetails]);

  useEffect(() => {
    if (refreshData || isNewUnwindTxn) {
      setIsUpdating(true);
      startPolling();
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [refreshData, isNewUnwindTxn, fetchOverviewDetails]);

  return {
    loading: loading || isUpdating,
    overviewData,
    refreshOverviewData: fetchOverviewDetails,
  };
}
