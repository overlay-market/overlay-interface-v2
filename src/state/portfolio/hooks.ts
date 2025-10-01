import { useState, useEffect, useCallback, useRef } from "react";
import type {
  OpenPositionData,
  UnwindPositionData,
  OverlaySDK,
} from "overlay-sdk";
import type { Address } from "viem";
import { useAppSelector } from "../hooks";
import { TransactionType } from "../../constants/transaction";

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
  const fetchingRef = useRef(false);
  const isNewUnwindTxn = useIsNewUnwindTxn();

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);


  const fetchPositions = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      if (!account) {
        return false;
      }

      if (fetchingRef.current) {
        return true;
      }

      fetchingRef.current = true;

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
            pos.positionSide
          );
        });

        setPositions(validPositions);
        setPositionsTotalNumber(result.total);
        return true;
      } catch (error) {
        console.error(
          `Error fetching positions (attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchPositions(retryCount + 1);
        } else {
          return false;
        }
      } finally {
        fetchingRef.current = false;
      }
    },
    [
      account,
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
    if (account) {
      const initialFetch = async () => {
        setLoading(true);
        try {
          await fetchPositions();
        } finally {
          setLoading(false);
        }
      };
      initialFetch();
    } else {
      setPositions(undefined);
      setPositionsTotalNumber(0);
    }
  }, [account, currentPage, itemsPerPage, fetchPositions]);

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
  const fetchingRef = useRef(false);
  const isNewUnwindTxn = useIsNewUnwindTxn();

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const fetchUnwindPositions = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      if (!account) {
        return false;
      }

      if (fetchingRef.current) {
        return true;
      }

      fetchingRef.current = true;

      try {
        const result = await sdkRef.current.unwindPositions.transformUnwindPositions(
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
              pos.positionSide
            );
          }
        );

        setUnwindPositions(validUnwindPositions);
        setUnwindPositionsTotalNumber(result.total);

        return true;
      } catch (error) {
        console.error(
          `Error fetching unwind positions (attempt ${retryCount + 1}):`,
          error
        );

        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchUnwindPositions(retryCount + 1);
        } else {
          return false;
        }
      } finally {
        fetchingRef.current = false;
      }
    },
    [
      account,
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
    if (account) {
      const initialFetch = async () => {
        setLoading(true);
        try {
          await fetchUnwindPositions();
        } finally {
          setLoading(false);
        }
      };
      initialFetch();
    } else {
      setUnwindPositions(undefined);
      setUnwindPositionsTotalNumber(0);
    }
  }, [account, currentPage, itemsPerPage, fetchUnwindPositions]);

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
