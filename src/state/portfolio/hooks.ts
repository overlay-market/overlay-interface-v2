import { useState, useEffect, useCallback, useRef } from "react";
import type {
  OpenPositionData,
  UnwindPositionData,
  OverlaySDK,
} from "overlay-sdk";
import type { Address } from "viem";
import { useAppSelector } from "../hooks";
import { TransactionType } from "../../constants/transaction";
import usePrevious from "../../hooks/usePrevious";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const POLLING_INTERVAL = 5000;
const MAX_POLLING_TIME = 60000;

export function useIsNewUnwindTxn(): boolean {
  const txnHash = useAppSelector((state) => state.trade.txnHash);
  const activePopups = useAppSelector((state) => state.application.popupList);

  const currentTxnPopup = activePopups.find(
    (popup) => 'txn' in popup.content && popup.content.txn.hash === txnHash && popup.show
  );

  return Boolean(
    currentTxnPopup &&
    'txn' in currentTxnPopup.content &&
    currentTxnPopup.content.txn.type === TransactionType.UNWIND_OVL_POSITION &&
    currentTxnPopup.content.txn.success === true
  );
}

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
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isNewUnwindTxn = useIsNewUnwindTxn();
  const previousValidPositions = usePrevious(positions);

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const arePositionsEqual = (
    arr1: OpenPositionData[] | undefined,
    arr2: OpenPositionData[] | undefined
  ): boolean => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    if (arr1 === arr2) return true;
  
    return arr1.every((pos1, i) => {
      const pos2 = arr2[i];
      if (!pos2) return false;
  
      const keys1 = Object.keys(pos1) as (keyof OpenPositionData)[];
      return keys1.every(key => pos1[key] === pos2[key]);
    });
  };

  const fetchPositions = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      if (!account) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
        return false;
      }

      try {
        const result = await sdkRef.current.openPositions.transformOpenPositions(
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

        const hasNewData = !arePositionsEqual(validPositions, previousValidPositions) && Boolean(validPositions);
        setPositions(validPositions);
        setPositionsTotalNumber(result.total);
        return hasNewData;
      } catch (error) {
        console.error(
          `Error fetching positions (attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchPositions(retryCount + 1);
        } else {
          setPositions(undefined);
          setPositionsTotalNumber(0);
          return false;
        }
      }
    },
    [
      account,
      isNewTxnHash,
      isNewUnwindTxn,
      currentPage,
      itemsPerPage,  
    ]
  );

  const startPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    startTimeRef.current = Date.now();

    const poll = async () => {
      const hasNewData = await fetchPositions();
      const elapsedTime = Date.now() - (startTimeRef.current || 0);

      if (hasNewData || elapsedTime >= MAX_POLLING_TIME) {
        setIsUpdating(false);
        return;
      }

      pollingTimeoutRef.current = setTimeout(poll, POLLING_INTERVAL);
    };

    poll();
  }, [fetchPositions]);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      await fetchPositions();
      setLoading(false);
    };

    refresh();
  }, [fetchPositions]);

  useEffect(() => {
    if (isNewTxnHash || isNewUnwindTxn) {
      setIsUpdating(true);
      startPolling();
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [isNewTxnHash, isNewUnwindTxn, startPolling]);

  return {
    loading: loading || isUpdating,
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [unwindPositions, setUnwindPositions] = useState<
    UnwindPositionData[] | undefined
  >(undefined);
  const [unwindPositionsTotalNumber, setUnwindPositionsTotalNumber] =
    useState(0);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isNewUnwindTxn = useIsNewUnwindTxn();
  const previousTotalRef = useRef(0);

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

        const hasNewData = result.total !== previousTotalRef.current;

        setUnwindPositions(validUnwindPositions);
        setUnwindPositionsTotalNumber(result.total);
        previousTotalRef.current = result.total;

        return hasNewData;
      } catch (error) {
        console.error(
          `Error fetching unwind positions (attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
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
      isNewUnwindTxn,
      currentPage,
      itemsPerPage,
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
        setIsUpdating(false);
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
    if (isNewTxnHash || isNewUnwindTxn) {
      setIsUpdating(true);
      startPolling();
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [isNewTxnHash, isNewUnwindTxn, startPolling]);

  return {
    loading: loading || isUpdating,
    unwindPositions,
    unwindPositionsTotalNumber,
    refreshUnwindPositions: fetchUnwindPositions,
  };
}
