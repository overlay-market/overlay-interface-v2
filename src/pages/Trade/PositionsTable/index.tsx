import { Text } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  LineSeparator,
  PositionsTableContainer,
} from "./positions-table-styles";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import OpenPosition from "./OpenPosition";
import { Address } from "viem";
import { useIsNewTxnHash, useOptimisticPositions, useOptimisticPositionHandlers } from "../../../state/trade/hooks";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { convertToOpenPositionData } from "../../../utils/convertOptimisticPosition";

const POSITIONS_COLUMNS = [
  "Size",
  "Position",
  "Entry Price",
  "Liq. Price",
  "PnL",
];

const PositionsTable: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();
  const optimisticPositions = useOptimisticPositions();
  const { handleRemoveOptimisticPosition } = useOptimisticPositionHandlers();

  const [loading, setLoading] = useState<boolean>(false);
  const [positions, setPositions] = useState<OpenPositionData[] | undefined>(
    undefined
  );

  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [forceRefresh, setForceRefresh] = useState(0); // Counter to force refresh
  const previousPositionCountRef = useRef<number>(0); // Track position count before transaction
  const currentPositionCountRef = useRef<number>(0); // Track current position count (for polling)

  const isTablet = useMediaQuery("(max-width: 1279px)");

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  // Update current position count ref whenever it changes
  useEffect(() => {
    currentPositionCountRef.current = positionsTotalNumber;
  }, [positionsTotalNumber]);

  // Debug: Log when isNewTxnHash changes to true (transaction detected)
  useEffect(() => {
    if (isNewTxnHash) {
      console.log('[PositionsTable] New transaction detected, isNewTxnHash = true');
    }
  }, [isNewTxnHash]);

  // Poll for new positions after transaction until we find it or timeout
  useEffect(() => {
    if (!isNewTxnHash) return;

    console.log('[PositionsTable] New transaction detected, starting position polling');
    // Store current position count to detect when it increases
    previousPositionCountRef.current = currentPositionCountRef.current;

    let pollCount = 0;
    const maxPolls = 20; // Poll every 3 seconds for 60 seconds total

    const pollInterval = setInterval(() => {
      pollCount++;

      // Check if we found the new position (count increased) - using ref to avoid stale closure
      const currentCount = currentPositionCountRef.current;
      const previousCount = previousPositionCountRef.current;

      if (currentCount > previousCount) {
        console.log('[PositionsTable] ✅ New position detected! Position count increased from', previousCount, 'to', currentCount);
        clearInterval(pollInterval);
        return;
      }

      console.log(`[PositionsTable] Polling for new position (${pollCount}/${maxPolls}) - Current count: ${currentCount}`);
      setForceRefresh(prev => prev + 1); // Trigger re-fetch

      if (pollCount >= maxPolls) {
        console.log('[PositionsTable] Polling timeout - no new position found');
        clearInterval(pollInterval);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      console.log('[PositionsTable] Cleaning up polling interval');
      clearInterval(pollInterval);
    };
  }, [isNewTxnHash]); // Only depend on isNewTxnHash - don't restart on positionsTotalNumber change

  // Additional trigger: Start polling when new optimistic position is added
  useEffect(() => {
    if (optimisticPositions.length === 0) return;

    // Get the newest optimistic position (newest is at index 0)
    const newestOptimistic = optimisticPositions[0];
    const timeSinceCreation = Date.now() - newestOptimistic.createdAt;

    // If position was just created (within 2 seconds), trigger a refresh
    if (timeSinceCreation < 2000) {
      console.log('[PositionsTable] New optimistic position detected, triggering immediate refresh');
      setForceRefresh(prev => prev + 1);
    }
  }, [optimisticPositions.length]);

  useEffect(() => {
    const fetchOpenPositions = async () => {
      if (!account || !marketId) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
        return; // Early exit if no account or marketId
      }

      if (marketId && account) {
        // Force cache bypass if new transaction or during polling period
        const refreshData = isNewTxnHash || forceRefresh > 0;
        setLoading(true);
        console.log('[PositionsTable] Fetching positions:', {
          marketId,
          refreshData,
          isNewTxnHash,
          forceRefresh,
        });
        try {
          // marketId from useSearchParams() is already decoded
          const positions =
            await sdkRef.current.openPositions.transformOpenPositions(
              currentPage,
              itemsPerPage,
              marketId,
              account as Address,
              refreshData
            );

          console.log('[PositionsTable] Received positions:', {
            count: positions?.data?.length || 0,
            total: positions?.total || 0,
            positions: positions?.data,
          });

          positions && setPositions(positions.data);
          positions && setPositionsTotalNumber(positions.total);
          if (!positions) {
            setPositions(undefined);
            setPositionsTotalNumber(0);
          }
        } catch (error) {
          console.error("Error fetching open positions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOpenPositions();
  }, [chainId, marketId, account, isNewTxnHash, forceRefresh, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    setItemsPerPage(10);
  }, [chainId, marketId]);

  // Merge optimistic positions with real positions
  const mergedPositions = useMemo(() => {
    // marketId from useSearchParams() is already decoded
    // Filter optimistic positions for current market AND current account
    const relevantOptimistic = optimisticPositions
      .filter(op =>
        op.marketName === marketId &&
        op.account === account &&
        op.chainId === chainId
      )
      .map(op => convertToOpenPositionData(op));

    // If no real positions yet, just return optimistic ones (or undefined if none)
    if (!positions) {
      return relevantOptimistic.length > 0 ? relevantOptimistic : undefined;
    }

    // Prepend optimistic positions (show at top)
    return [...relevantOptimistic, ...positions];
  }, [positions, optimisticPositions, marketId, account, chainId]);

  // Smart detection: Remove optimistic positions when matching real position appears
  // This runs whenever positions change OR during polling period
  useEffect(() => {
    if (!positions || optimisticPositions.length === 0) return;

    // Check each optimistic position for a matching real position
    optimisticPositions.forEach(optimistic => {

      // Find matching real position by market, side, leverage
      // Sort positions by creation time (newest first) to prioritize recent positions
      const sortedPositions = [...positions].sort((a, b) => {
        const timeA = new Date(a.parsedCreatedTimestamp || 0).getTime();
        const timeB = new Date(b.parsedCreatedTimestamp || 0).getTime();
        return timeB - timeA; // Newest first
      });

      // First try: Match by timestamp (within 2 minutes)
      let matchingReal = sortedPositions.find(real => {
        // Defensive checks for undefined values
        if (!real.marketName || !real.positionSide || !marketId) return false;

        const sameMarket = real.marketName === marketId;
        const sameSide = real.positionSide.includes(optimistic.isLong ? 'Long' : 'Short');

        // Extract leverage from real position (e.g., "13.10000000000000000120018702277545x Short" -> 13.1)
        const realLeverageMatch = real.positionSide.match(/^([\d.]+)x/);
        const realLeverage = realLeverageMatch ? parseFloat(realLeverageMatch[1]) : null;
        const optimisticLeverageNum = parseFloat(optimistic.leverage);

        // Defensive check for NaN
        if (realLeverage === null || isNaN(optimisticLeverageNum)) return false;

        // Match if leverage is within 0.01 tolerance (handles precision differences)
        const sameLeverage = Math.abs(realLeverage - optimisticLeverageNum) < 0.01;

        // Check if real position was created recently (within 2 minutes of optimistic for safety)
        const realTimestamp = real.parsedCreatedTimestamp
          ? new Date(real.parsedCreatedTimestamp).getTime()
          : 0;
        const optimisticTimestamp = optimistic.createdAt;
        const timeDiff = Math.abs(realTimestamp - optimisticTimestamp);
        const isRecent = realTimestamp > 0 && timeDiff < 120_000; // 2 minute window (extended for subgraph lag)

        const isMatch = sameMarket && sameSide && sameLeverage && isRecent;

        // Only log when we find a match (reduce spam)
        if (isMatch) {
          console.log('[Smart Detection] ✅ Timestamp match found:', {
            market: real.marketName,
            side: real.positionSide,
            positionId: real.positionId,
          });
        }

        return isMatch;
      });

      // Fallback: If no timestamp match, match the FIRST (newest) position with same market/side/leverage
      // This handles cases where subgraph returns stale timestamps
      if (!matchingReal) {
        matchingReal = sortedPositions.find(real => {
          // Defensive checks for undefined values
          if (!real.marketName || !real.positionSide || !marketId) return false;

          const sameMarket = real.marketName === marketId;
          const sameSide = real.positionSide.includes(optimistic.isLong ? 'Long' : 'Short');

          // Extract leverage numerically (same as timestamp match above)
          const realLeverageMatch = real.positionSide.match(/^([\d.]+)x/);
          const realLeverage = realLeverageMatch ? parseFloat(realLeverageMatch[1]) : null;
          const optimisticLeverageNum = parseFloat(optimistic.leverage);

          // Defensive check for NaN
          if (realLeverage === null || isNaN(optimisticLeverageNum)) return false;

          const sameLeverage = Math.abs(realLeverage - optimisticLeverageNum) < 0.01;
          const isMatch = sameMarket && sameSide && sameLeverage;

          // Only log when we find a match
          if (isMatch) {
            console.log('[Smart Detection] ✅ Fallback match found:', {
              market: real.marketName,
              side: real.positionSide,
              positionId: real.positionId,
            });
          }

          return isMatch;
        });
      }

      // If matching real position found, remove optimistic immediately
      if (matchingReal) {
        console.log('[Smart Detection] Removing optimistic position for', optimistic.marketName);
        handleRemoveOptimisticPosition(optimistic.txHash);
      }
      // Silently continue if no match (reduces spam - it's expected during polling)
    });
  }, [positions, optimisticPositions, marketId, forceRefresh, handleRemoveOptimisticPosition]);

  // Cleanup stale optimistic positions (older than 2 minutes)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      optimisticPositions.forEach(op => {
        if (now - op.createdAt > 120_000) {
          handleRemoveOptimisticPosition(op.txHash);
        }
      });
    }, 10_000); // Check every 10 seconds

    return () => clearInterval(cleanup);
  }, [optimisticPositions, handleRemoveOptimisticPosition]);

  return (
    <>
      <LineSeparator />

      <PositionsTableContainer>
        <Text weight={"bold"} size={"5"}>
          Positions
        </Text>

        <StyledTable
          headerColumns={POSITIONS_COLUMNS}
          width={isTablet ? "100%" : "849px"}
          minWidth={"654px"}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          positionsTotalNumber={positionsTotalNumber}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          body={
            mergedPositions &&
            mergedPositions.map((position: OpenPositionData, index: number) => (
              <OpenPosition position={position} key={index} />
            ))
          }
        />

        {loading && !mergedPositions ? (
          <Loader />
        ) : account ? (
          mergedPositions &&
          positionsTotalNumber === 0 &&
          optimisticPositions.filter(op =>
            op.marketName === marketId &&
            op.account === account &&
            op.chainId === chainId
          ).length === 0 &&
          <Text>No current positions</Text>
        ) : (
          <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
        )}
      </PositionsTableContainer>

      <LineSeparator />
    </>
  );
};

export default PositionsTable;
