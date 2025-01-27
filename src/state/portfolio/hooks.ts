import { useState, useEffect, useCallback, useRef } from "react";
import type {
  OpenPositionData,
  UnwindPositionData,
  OverlaySDK,
} from "overlay-sdk";
import type { Address } from "viem";
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const POLLING_INTERVAL = 5000;
const MAX_POLLING_TIME = 60000;

export function usePositionRefresh(
  sdk: OverlaySDK,
  account: Address | undefined,
  isNewTxnHash: boolean,
  currentPage: number,
  itemsPerPage: number
) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<OpenPositionData[] | undefined>(
    undefined
  );
  const [positionsTotalNumber, setPositionsTotalNumber] = useState(0);

  const fetchPositions = useCallback(
    async (retryCount = 0): Promise<void> => {
      if (!account) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
        return;
      }

      try {
        const result = await sdk.openPositions.transformOpenPositions(
          currentPage,
          itemsPerPage,
          undefined,
          account as Address,
          isNewTxnHash
        );

        if (!result || !result.data) {
          throw new Error("No position data received");
        }

        const validPositions = result.data.filter((pos: OpenPositionData) => {
          return (
            pos &&
            pos.marketName &&
            pos.size &&
            pos.positionSide &&
            pos.entryPrice &&
            pos.currentPrice &&
            pos.liquidatePrice &&
            pos.parsedCreatedTimestamp
          );
        });

        setPositions(validPositions);
        setPositionsTotalNumber(validPositions.length);
      } catch (error) {
        console.error(
          `Error fetching positions (attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          await fetchPositions(retryCount + 1);
        } else {
          setPositions(undefined);
          setPositionsTotalNumber(0);
        }
      }
    },
    [sdk, account, isNewTxnHash, currentPage, itemsPerPage]
  );

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      await fetchPositions();
      setLoading(false);
    };

    refresh();
  }, [fetchPositions]);

  return {
    loading,
    positions,
    positionsTotalNumber,
    refreshPositions: fetchPositions,
  };
}

export function useUnwindPositionRefresh(
  sdk: OverlaySDK,
  account: Address | undefined,
  isNewTxnHash: boolean,
  currentPage: number,
  itemsPerPage: number
) {
  const [loading, setLoading] = useState(false);
  const [unwindPositions, setUnwindPositions] = useState<
    UnwindPositionData[] | undefined
  >(undefined);
  const [unwindPositionsTotalNumber, setUnwindPositionsTotalNumber] =
    useState(0);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const fetchUnwindPositions = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      if (!account) {
        setUnwindPositions(undefined);
        setUnwindPositionsTotalNumber(0);
        return false;
      }

      try {
        const result = await sdk.unwindPositions.transformUnwindPositions(
          currentPage,
          itemsPerPage,
          undefined,
          account as Address,
          isNewTxnHash
        );

        if (!result || !result.data) {
          throw new Error("No unwind position data received");
        }

        const validUnwindPositions = result.data.filter(
          (pos: UnwindPositionData) => {
            return (
              pos &&
              pos.marketName &&
              pos.size &&
              pos.positionSide &&
              pos.entryPrice &&
              pos.exitPrice &&
              pos.parsedCreatedTimestamp &&
              pos.parsedClosedTimestamp &&
              pos.pnl
            );
          }
        );

        const hasNewData =
          validUnwindPositions.length !== unwindPositionsTotalNumber;

        setUnwindPositions(validUnwindPositions);
        setUnwindPositionsTotalNumber(validUnwindPositions.length);

        return hasNewData;
      } catch (error) {
        console.error(
          `Error fetching unwind positions (attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
          // Wait and retry
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchUnwindPositions(retryCount + 1);
        } else {
          setUnwindPositions(undefined);
          setUnwindPositionsTotalNumber(0);
          return false;
        }
      }
    },
    [
      sdk,
      account,
      isNewTxnHash,
      currentPage,
      itemsPerPage,
      unwindPositionsTotalNumber,
    ]
  );

  const startPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    startTimeRef.current = Date.now();

    const poll = async () => {
      const hasNewData = await fetchUnwindPositions();
      const elapsedTime = Date.now() - (startTimeRef.current || 0);

      if (hasNewData || elapsedTime >= MAX_POLLING_TIME) {
        return;
      }

      pollingTimeoutRef.current = setTimeout(poll, POLLING_INTERVAL);
    };

    poll();
  }, [fetchUnwindPositions]);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      await fetchUnwindPositions();
      setLoading(false);
    };

    refresh();
  }, [fetchUnwindPositions]);

  useEffect(() => {
    if (isNewTxnHash) {
      startPolling();
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [isNewTxnHash, startPolling]);

  return {
    loading,
    unwindPositions,
    unwindPositionsTotalNumber,
    refreshUnwindPositions: fetchUnwindPositions,
  };
}
