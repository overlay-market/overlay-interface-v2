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
import usePositionsPnL from "../../../hooks/usePositionsPnL";
import { DEFAULT_CHAINID } from "../../../constants/chains";
import { PREDICTION_MARKET_GROUPS } from "../../../constants/markets";

const POSITIONS_COLUMNS = [
  "Size",
  "Position",
  "Entry Price",
  "Liq. Price",
  "PnL",
];

const GROUP_POSITIONS_COLUMNS = [
  "Outcome",
  "Size",
  "Position",
  "Entry Price",
  "Liq. Price",
  "PnL",
];

interface PositionsTableProps {
  onPricesUpdate?: (prices: { bid: bigint; ask: bigint; mid: bigint } | undefined) => void;
  groupMarketIds?: string[];
}

const PositionsTable: React.FC<PositionsTableProps> = ({ onPricesUpdate, groupMarketIds }) => {
  const [searchParams] = useSearchParams();
  const rawMarketId = searchParams.get("market");
  const marketId = rawMarketId ? decodeURIComponent(rawMarketId) : null;

  // For prediction groups, fetch positions for all markets in the group
  const marketIdForFetch: string | string[] | null = useMemo(() => {
    if (groupMarketIds && groupMarketIds.length > 0) {
      return groupMarketIds.map(id => decodeURIComponent(id));
    }
    return marketId;
  }, [groupMarketIds, marketId]);
  const { chainId: rawChainId } = useMultichainContext();
  const chainId = typeof rawChainId === 'object' && rawChainId !== null
    ? rawChainId.id
    : (rawChainId ?? DEFAULT_CHAINID);
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
  const knownPositionIdsRef = useRef<Set<number>>(new Set()); // Track position IDs that existed before trade

  const isTablet = useMediaQuery("(max-width: 1279px)");

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  // Update current position count ref whenever it changes
  useEffect(() => {
    currentPositionCountRef.current = positionsTotalNumber;
  }, [positionsTotalNumber]);

  // Snapshot known position IDs when no optimistic positions exist (baseline)
  useEffect(() => {
    if (positions && optimisticPositions.length === 0) {
      knownPositionIdsRef.current = new Set(positions.map(p => p.positionId));
    }
  }, [positions, optimisticPositions.length]);

  // Reset forceRefresh when the post-transaction window closes
  useEffect(() => {
    if (!isNewTxnHash && forceRefresh > 0) {
      setForceRefresh(0);
    }
  }, [isNewTxnHash, forceRefresh]);

  // Poll for new positions after transaction until we find it or timeout
  useEffect(() => {
    if (!isNewTxnHash) return;



    let pollCount = 0;
    const maxPolls = 20; // Poll every 3 seconds for 60 seconds total

    const pollInterval = setInterval(() => {
      pollCount++;

      // Set baseline on first tick (after the initial fetch has had time to complete)
      // This avoids the 0 → N false positive when the component just mounted
      if (pollCount === 1) {
        previousPositionCountRef.current = currentPositionCountRef.current;
      }

      // Check if we found the new position (count increased) - using ref to avoid stale closure
      const currentCount = currentPositionCountRef.current;
      const previousCount = previousPositionCountRef.current;

      if (previousCount > 0 && currentCount > previousCount) {

        clearInterval(pollInterval);
        return;
      }


      setForceRefresh(prev => prev + 1); // Trigger re-fetch

      if (pollCount >= maxPolls) {

        clearInterval(pollInterval);
      }
    }, 3000); // Poll every 3 seconds

    return () => {

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

      setForceRefresh(prev => prev + 1);
    }
  }, [optimisticPositions.length]);

  useEffect(() => {
    const fetchOpenPositions = async () => {
      if (!account || !marketIdForFetch) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
        return; // Early exit if no account or marketId
      }

      if (marketIdForFetch && account) {
        // Force cache bypass if new transaction or during polling period
        const refreshData = isNewTxnHash || forceRefresh > 0;
        setLoading(true);

        try {
          const positions =
            await sdkRef.current.openPositions.transformOpenPositions(
              currentPage,
              itemsPerPage,
              marketIdForFetch,
              account as Address,
              refreshData
            );



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
  }, [chainId, marketIdForFetch, account, isNewTxnHash, forceRefresh, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    setItemsPerPage(10);
  }, [chainId, marketIdForFetch]);

  const isGroupMode = !!(groupMarketIds && groupMarketIds.length > 0);

  const getOutcomeLabel = useMemo(() => {
    // Build a lookup from marketName -> short label (e.g. "Google")
    const labelMap = new Map<string, string>();
    for (const group of PREDICTION_MARKET_GROUPS) {
      for (const [encodedId, label] of Object.entries(group.outcomeLabels)) {
        labelMap.set(decodeURIComponent(encodedId), label);
      }
    }
    return (marketName?: string) => {
      if (!marketName) return undefined;
      return labelMap.get(marketName) ?? marketName;
    };
  }, []);

  // Set of market IDs relevant for optimistic position matching
  const relevantMarketIds = useMemo(() => {
    if (groupMarketIds && groupMarketIds.length > 0) {
      return new Set(groupMarketIds.map(id => decodeURIComponent(id)));
    }
    return marketId ? new Set([marketId]) : new Set<string>();
  }, [groupMarketIds, marketId]);

  // Merge optimistic positions with real positions
  const mergedPositions = useMemo(() => {
    // Filter optimistic positions for current market(s) AND current account
    const relevantOptimistic = optimisticPositions
      .filter(op =>
        relevantMarketIds.has(op.marketName) &&
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
  }, [positions, optimisticPositions, relevantMarketIds, account, chainId]);

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
        if (!real.marketName || !real.positionSide || relevantMarketIds.size === 0) return false;

        const sameMarket = relevantMarketIds.has(real.marketName);
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

        }

        return isMatch;
      });

      // Fallback: If no timestamp match, match a NEW position (not in pre-trade snapshot)
      // with same market/side/leverage. This handles stale subgraph timestamps.
      if (!matchingReal) {
        matchingReal = sortedPositions.find(real => {
          // Only match positions that appeared AFTER the trade
          if (knownPositionIdsRef.current.has(real.positionId)) return false;

          // Defensive checks for undefined values
          if (!real.marketName || !real.positionSide || relevantMarketIds.size === 0) return false;

          const sameMarket = relevantMarketIds.has(real.marketName);
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

          }

          return isMatch;
        });
      }

      // If matching real position found, remove optimistic immediately
      if (matchingReal) {

        handleRemoveOptimisticPosition(optimistic.txHash);
      }
      // Silently continue if no match (reduces spam - it's expected during polling)
    });
  }, [positions, optimisticPositions, relevantMarketIds, handleRemoveOptimisticPosition]);

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

  // Real-time PnL updates
  const positionsList = useMemo(
    () =>
      positions?.map((p) => ({
        marketAddress: p.marketAddress,
        positionId: p.positionId,
        router: p.router,
        loan: p.loan,
      })) ?? [],
    [positions]
  );

  const { pnlData, prices } = usePositionsPnL(marketId, positionsList);

  // Report prices to parent component for use in Chart and TradeWidget
  useEffect(() => {
    if (onPricesUpdate) {
      onPricesUpdate(prices);
    }
  }, [prices, onPricesUpdate]);

  return (
    <>
      <LineSeparator />

      <PositionsTableContainer>
        <Text weight={"bold"} size={"5"}>
          Positions
        </Text>

        <StyledTable
          headerColumns={isGroupMode ? GROUP_POSITIONS_COLUMNS : POSITIONS_COLUMNS}
          width={isTablet ? "100%" : "849px"}
          minWidth={"654px"}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          positionsTotalNumber={positionsTotalNumber}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          body={
            mergedPositions &&
            mergedPositions.map((position: OpenPositionData, index: number) => {
              const pnlKey = `${position.marketAddress}-${position.positionId}`;
              const realtimePnL = pnlData.get(pnlKey);

              return (
                <OpenPosition
                  position={position}
                  realtimePnL={realtimePnL}
                  outcomeLabel={isGroupMode ? getOutcomeLabel(position.marketName) : undefined}
                  key={`${position.marketAddress}-${position.positionId}-${index}`}
                />
              );
            })
          }
        />

        {loading && !mergedPositions ? (
          <Loader />
        ) : account ? (
          mergedPositions &&
          positionsTotalNumber === 0 &&
          optimisticPositions.filter(op =>
            relevantMarketIds.has(op.marketName) &&
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
