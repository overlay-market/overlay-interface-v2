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
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import usePositionsPnL from "../../../hooks/usePositionsPnL";

const POSITIONS_COLUMNS = [
  "Size",
  "Position",
  "Entry Price",
  "Liq. Price",
  "PnL",
];

interface PositionsTableProps {
  onPricesUpdate?: (prices: { bid: bigint; ask: bigint; mid: bigint } | undefined) => void;
}

const PositionsTable: React.FC<PositionsTableProps> = ({ onPricesUpdate }) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const [loading, setLoading] = useState<boolean>(false);
  const [positions, setPositions] = useState<OpenPositionData[] | undefined>(
    undefined
  );

  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isTablet = useMediaQuery("(max-width: 1279px)");

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  useEffect(() => {
    const fetchOpenPositions = async () => {
      if (!account || !marketId) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
      }

      if (marketId && account) {
        const refreshData = isNewTxnHash;
        setLoading(true);
        try {
          const positions =
            await sdkRef.current.openPositions.transformOpenPositions(
              currentPage,
              itemsPerPage,
              marketId,
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
  }, [chainId, marketId, account, isNewTxnHash, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    setItemsPerPage(10);
  }, [chainId, marketId]);

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
          headerColumns={POSITIONS_COLUMNS}
          width={isTablet ? "100%" : "849px"}
          minWidth={"654px"}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          positionsTotalNumber={positionsTotalNumber}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          body={
            positions &&
            positions.map((position: OpenPositionData) => {
              const pnlKey = `${position.marketAddress}-${position.positionId}`;
              const realtimePnL = pnlData.get(pnlKey);

              return (
                <OpenPosition
                  position={position}
                  realtimePnL={realtimePnL}
                  key={`${position.marketAddress}-${position.positionId}`}
                />
              );
            })
          }
        />

        {loading && !positions ? (
          <Loader />
        ) : account ? (
          positions &&
          positionsTotalNumber === 0 && <Text>No current positions</Text>
        ) : (
          <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
        )}
      </PositionsTableContainer>

      <LineSeparator />
    </>
  );
};

export default PositionsTable;
