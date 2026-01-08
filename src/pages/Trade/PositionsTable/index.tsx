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

  // Debug: Log when isNewTxnHash changes
  useEffect(() => {
    console.log('[PositionsTable] isNewTxnHash changed:', isNewTxnHash);
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

    // Get the newest optimistic position
    const newestOptimistic = optimisticPositions[optimisticPositions.length - 1];
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
          decodedMarketId: decodeURIComponent(marketId),
          refreshData,
          isNewTxnHash,
          forceRefresh,
        });
        try {
          // Decode market ID before passing to SDK (URL may have encoded spaces)
          const decodedMarketId = decodeURIComponent(marketId);
          const positions =
            await sdkRef.current.openPositions.transformOpenPositions(
              currentPage,
              itemsPerPage,
              decodedMarketId,
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
    // Decode URL-encoded marketId (e.g., "Counter-Strike%202%20Skins" -> "Counter-Strike 2 Skins")
    const decodedMarketId = marketId ? decodeURIComponent(marketId) : null;

    // Filter optimistic positions for current market
    // Note: marketId from URL is the market NAME, not address
    const relevantOptimistic = optimisticPositions
      .filter(op => op.marketName === decodedMarketId)
      .map(op => convertToOpenPositionData(op));

    // If no real positions yet, just return optimistic ones (or undefined if none)
    if (!positions) {
      return relevantOptimistic.length > 0 ? relevantOptimistic : undefined;
    }

    // Prepend optimistic positions (show at top)
    return [...relevantOptimistic, ...positions];
  }, [positions, optimisticPositions, marketId]);

  // Smart detection: Remove optimistic positions when matching real position appears
  // This runs whenever positions change OR during polling period
  useEffect(() => {
    if (!positions || optimisticPositions.length === 0) return;

    const decodedMarketId = marketId ? decodeURIComponent(marketId) : null;

    console.log('[Smart Detection] Running check with', {
      positionCount: positions.length,
      optimisticCount: optimisticPositions.length,
      forceRefresh,
    });

    // Check each optimistic position for a matching real position
    optimisticPositions.forEach(optimistic => {
      console.log('[Smart Detection] Checking optimistic position:', {
        market: optimistic.marketName,
        side: optimistic.isLong ? 'Long' : 'Short',
        collateral: optimistic.collateral,
        leverage: optimistic.leverage,
        txHash: optimistic.txHash,
        createdAt: new Date(optimistic.createdAt).toISOString(),
      });

      // Find matching real position by market, side, leverage
      // Sort positions by creation time (newest first) to prioritize recent positions
      const sortedPositions = [...positions].sort((a, b) => {
        const timeA = new Date(a.parsedCreatedTimestamp || 0).getTime();
        const timeB = new Date(b.parsedCreatedTimestamp || 0).getTime();
        return timeB - timeA; // Newest first
      });

      // First try: Match by timestamp (within 2 minutes)
      let matchingReal = sortedPositions.find(real => {
        const sameMarket = real.marketName === decodedMarketId;
        const sameSide = real.positionSide?.includes(optimistic.isLong ? 'Long' : 'Short');

        // Extract leverage from real position (e.g., "13.10000000000000000120018702277545x Short" -> 13.1)
        const realLeverageMatch = real.positionSide?.match(/^([\d.]+)x/);
        const realLeverage = realLeverageMatch ? parseFloat(realLeverageMatch[1]) : null;
        const optimisticLeverageNum = parseFloat(optimistic.leverage);
        // Match if leverage is within 0.01 tolerance (handles precision differences)
        const sameLeverage = realLeverage !== null && Math.abs(realLeverage - optimisticLeverageNum) < 0.01;

        // Check if real position was created recently (within 2 minutes of optimistic for safety)
        const realTimestamp = real.parsedCreatedTimestamp
          ? new Date(real.parsedCreatedTimestamp).getTime()
          : 0;
        const optimisticTimestamp = optimistic.createdAt;
        const timeDiff = Math.abs(realTimestamp - optimisticTimestamp);
        const isRecent = realTimestamp > 0 && timeDiff < 120_000; // 2 minute window (extended for subgraph lag)

        console.log('[Smart Detection] Comparing with real position (timestamp match):', {
          realMarket: real.marketName,
          expectedMarket: decodedMarketId,
          sameMarket,
          realSide: real.positionSide,
          expectedSide: optimistic.isLong ? 'Long' : 'Short',
          sameSide,
          realLeverage,
          optimisticLeverage: optimisticLeverageNum,
          leverageDiff: realLeverage ? Math.abs(realLeverage - optimisticLeverageNum) : null,
          sameLeverage,
          realTimestamp: new Date(realTimestamp).toISOString(),
          optimisticTimestamp: new Date(optimisticTimestamp).toISOString(),
          timeDiff: `${(timeDiff / 1000).toFixed(1)}s`,
          isRecent,
          positionId: real.positionId,
          MATCH: sameMarket && sameSide && sameLeverage && isRecent,
        });

        return sameMarket && sameSide && sameLeverage && isRecent;
      });

      // Fallback: If no timestamp match, match the FIRST (newest) position with same market/side/leverage
      // This handles cases where subgraph returns stale timestamps
      if (!matchingReal) {
        console.log('[Smart Detection] No timestamp match, trying fallback match (newest position)');
        matchingReal = sortedPositions.find(real => {
          const sameMarket = real.marketName === decodedMarketId;
          const sameSide = real.positionSide?.includes(optimistic.isLong ? 'Long' : 'Short');

          // Extract leverage numerically (same as timestamp match above)
          const realLeverageMatch = real.positionSide?.match(/^([\d.]+)x/);
          const realLeverage = realLeverageMatch ? parseFloat(realLeverageMatch[1]) : null;
          const optimisticLeverageNum = parseFloat(optimistic.leverage);
          const sameLeverage = realLeverage !== null && Math.abs(realLeverage - optimisticLeverageNum) < 0.01;

          console.log('[Smart Detection] Fallback match check:', {
            realMarket: real.marketName,
            expectedMarket: decodedMarketId,
            sameMarket,
            realSide: real.positionSide,
            sameSide,
            realLeverage,
            optimisticLeverage: optimisticLeverageNum,
            leverageDiff: realLeverage ? Math.abs(realLeverage - optimisticLeverageNum) : null,
            sameLeverage,
            positionId: real.positionId,
            MATCH: sameMarket && sameSide && sameLeverage,
          });

          return sameMarket && sameSide && sameLeverage;
        });
      }

      // If matching real position found, remove optimistic immediately
      if (matchingReal) {
        console.log('[Smart Detection] ✅ MATCH FOUND! Removing optimistic position');
        handleRemoveOptimisticPosition(optimistic.txHash);
      } else {
        console.log('[Smart Detection] ❌ NO MATCH FOUND for optimistic position');
      }
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
          optimisticPositions.filter(op => op.marketName === (marketId ? decodeURIComponent(marketId) : null)).length === 0 &&
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
