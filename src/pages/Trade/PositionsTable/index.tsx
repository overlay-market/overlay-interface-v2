import { Text } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useEffect, useMemo, useState } from "react";
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
import usePrevious from "../../../hooks/usePrevious";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [positions, setPositions] = useState<OpenPositionData[] | undefined>(
    undefined
  );

  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isTablet = useMediaQuery("(max-width: 1279px)");

  const previousMarketId = usePrevious(marketId);

  const isNewMarketId = useMemo(() => {
    return marketId !== previousMarketId;
  }, [marketId, previousMarketId]);

  useEffect(() => {
    const fetchOpenPositions = async () => {
      if (!account || !marketId) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
      }

      if (marketId && account) {
        setLoading(true);
        try {
          const positions = await sdk.openPositions.transformOpenPositions(
            currentPage,
            itemsPerPage,
            marketId,
            account as Address,
            isNewTxnHash || isNewMarketId
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
  }, [
    chainId,
    marketId,
    account,
    isNewTxnHash,
    isNewMarketId,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setItemsPerPage(10);
  }, [chainId, marketId]);

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
            positions.map((position: OpenPositionData, index: number) => (
              <OpenPosition position={position} key={index} />
            ))
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
