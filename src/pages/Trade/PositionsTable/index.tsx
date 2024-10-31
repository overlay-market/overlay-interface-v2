import { Text } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../hooks/useSDK";
import { useEffect, useState } from "react";
import { PositionsTableContainer } from "./positions-table-styles";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import OpenPosition from "./OpenPosition";
import { Address } from "viem";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import { OpenPositionData } from "../../../types/positionTypes";
import Loader from "../../../components/Loader";
import theme from "../../../theme";

const POSITIONS_COLUMNS = [
  "Size",
  "Position",
  "Entry Price",
  "Liq. Price",
  "PnL",
];

const PositionsTable: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const [loading, setLoading] = useState<boolean>(false);
  const [positions, setPositions] = useState<OpenPositionData[] | undefined>(
    undefined
  );
  const [paginatedPositions, setPaginatedPositions] = useState<
    OpenPositionData[] | undefined
  >(undefined);
  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchOpenPositions = async () => {
      setPositions(undefined);
      setPositionsTotalNumber(0);

      if (marketId && account) {
        setLoading(true);
        try {
          const positions = await sdk.openPositions.transformOpenPositions(
            undefined,
            undefined,
            marketId,
            account as Address
          );

          positions && setPositions(positions.data);
          const positionsLength = positions && positions.data.length;
          positionsLength && setPositionsTotalNumber(positionsLength);
        } catch (error) {
          console.error("Error fetching open positions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOpenPositions();
  }, [chainId, marketId, account, isNewTxnHash]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (positions && positions.length > 0) {
      const paginatedData = positions.slice(startIndex, endIndex);
      setPaginatedPositions(paginatedData);
    }
    if (!positions) {
      setPaginatedPositions(undefined);
    }
  }, [positions, currentPage, itemsPerPage, setItemsPerPage]);

  return (
    <PositionsTableContainer>
      <Text weight={"bold"} size={"5"}>
        Positions
      </Text>

      <StyledTable
        headerColumns={POSITIONS_COLUMNS}
        width={"796px"}
        minWidth={"600px"}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        positionsTotalNumber={positionsTotalNumber}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        body={
          paginatedPositions &&
          paginatedPositions.map(
            (position: OpenPositionData, index: number) => (
              <OpenPosition position={position} key={index} />
            )
          )
        }
      />

      {loading ? (
        <Loader />
      ) : account ? (
        positions &&
        positionsTotalNumber === 0 && <Text>No current positions</Text>
      ) : (
        <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
      )}
    </PositionsTableContainer>
  );
};

export default PositionsTable;
