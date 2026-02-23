import { Flex, Text } from "@radix-ui/themes";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCallback, useEffect, useRef, useState } from "react";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import { Address } from "viem";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import LiquidatedPosition from "./LiquidatedPosition";
import { LiquidatedPositionData } from "overlay-sdk";

const LIQUIDATED_POSITIONS_COLUMNS = [
  "Market",
  "Size",
  "Position",
  "Entry Price",
  "Exit Price",
  "Created",
  "Liquidated",
];

const LiquidatesTable: React.FC = () => {
  const sdk = useSDK();
  const { address: account } = useAccount();

  const [loading, setLoading] = useState<boolean>(false);
  const [liquidatePositions, setLiquidatePositions] = useState<
    LiquidatedPositionData[] | undefined
  >(undefined);
  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const sdkRef = useRef(sdk);
  const fetchVersionRef = useRef(0);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const fetchLiquidatePositions = useCallback(async () => {
    if (!account) {
      setLiquidatePositions(undefined);
      setPositionsTotalNumber(0);
      return;
    }

    const thisVersion = ++fetchVersionRef.current;
    setLoading(true);

    try {
      const liquidates =
        await sdkRef.current.liquidatedPositions.transformLiquidatedPositions(
          currentPage,
          itemsPerPage,
          undefined,
          account as Address
        );

      if (thisVersion !== fetchVersionRef.current) return;

      const validLiquidates = liquidates.data.filter(
        (pos: LiquidatedPositionData) => {
          return (
            pos &&
            pos.marketName &&
            pos.size &&
            pos.position &&
            pos.entryPrice &&
            pos.exitPrice &&
            pos.created &&
            pos.liquidated
          );
        }
      );

      validLiquidates && setLiquidatePositions(validLiquidates);
      liquidates && setPositionsTotalNumber(liquidates.total);
      if (!liquidates) {
        setLiquidatePositions(undefined);
        setPositionsTotalNumber(0);
      }
    } catch (error) {
      if (thisVersion !== fetchVersionRef.current) return;
      console.error("Error fetching liquidated positions:", error);
    } finally {
      if (thisVersion === fetchVersionRef.current) {
        setLoading(false);
      }
    }
  }, [account, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchLiquidatePositions();
  }, [fetchLiquidatePositions]);

  return (
    <Flex
      direction={"column"}
      pt={"16px"}
      pb={"120px"}
      width={"100%"}
      style={{
        borderBottom: `1px solid ${theme.color.darkBlue}`,
      }}
    >
      <Text weight={"bold"} size={"5"}>
        Liquidations
      </Text>

      <StyledTable
        headerColumns={LIQUIDATED_POSITIONS_COLUMNS}
        minWidth="800px"
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        positionsTotalNumber={positionsTotalNumber}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        body={
          liquidatePositions &&
          liquidatePositions.map(
            (position: LiquidatedPositionData, index: number) => (
              <LiquidatedPosition position={position} key={index} />
            )
          )
        }
      />

      {loading && !liquidatePositions ? (
        <Loader />
      ) : account ? (
        liquidatePositions &&
        positionsTotalNumber === 0 && (
          <Text>You have no liquidated positions</Text>
        )
      ) : (
        <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
      )}
    </Flex>
  );
};

export default LiquidatesTable;
