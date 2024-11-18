import { Flex, Text } from "@radix-ui/themes";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../hooks/useSDK";
import { useEffect, useState } from "react";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import OpenPosition from "./OpenPosition";
import { Address } from "viem";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";

const POSITIONS_COLUMNS = [
  "Market",
  "Size",
  "Position",
  "Entry Price",
  "Current Price",
  "Liq. Price",
  "Created",
  "Unrealized PnL",
  "Funding",
];

const OpenPositionsTable: React.FC = () => {
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

  useEffect(() => {
    const fetchOpenPositions = async () => {
      if (!account) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
      }

      if (account) {
        setLoading(true);
        try {
          const positions = await sdk.openPositions.transformOpenPositions(
            currentPage,
            itemsPerPage,
            undefined,
            account as Address
          );

          positions && setPositions(positions.data);
          if (!positions) {
            setPositions(undefined);
            setPositionsTotalNumber(0);
          }
          const positionsLength = positions && positions.total;
          positionsLength && setPositionsTotalNumber(positionsLength);
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
    account,
    isNewTxnHash,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
  ]);

  return (
    <Flex
      direction={"column"}
      pt={"36px"}
      pb={"66px"}
      width={"100%"}
      style={{
        borderBottom: `1px solid ${theme.color.darkBlue}`,
      }}
    >
      <Text weight={"bold"} size={"5"}>
        Open Positions
      </Text>

      <StyledTable
        headerColumns={POSITIONS_COLUMNS}
        minWidth="950px"
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
        positionsTotalNumber === 0 && <Text>You have no open positions</Text>
      ) : (
        <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
      )}
    </Flex>
  );
};

export default OpenPositionsTable;
