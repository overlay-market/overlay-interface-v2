import { Flex, Text } from "@radix-ui/themes";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useEffect, useState } from "react";
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
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { address: account } = useAccount();

  const [loading, setLoading] = useState<boolean>(false);
  const [liquidatePositions, setLiquidatePositions] = useState<
    LiquidatedPositionData[] | undefined
  >(undefined);
  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchLiquidatePositions = async () => {
      if (!account) {
        setLiquidatePositions(undefined);
        setPositionsTotalNumber(0);
      }

      if (account) {
        setLoading(true);
        try {
          const liquidates =
            await sdk.liquidatedPositions.transformLiquidatedPositions(
              currentPage,
              itemsPerPage,
              undefined,
              account as Address
            );

          liquidates && setLiquidatePositions(liquidates.data);
          liquidates && setPositionsTotalNumber(liquidates.total);
          if (!liquidates) {
            setLiquidatePositions(undefined);
            setPositionsTotalNumber(0);
          }
        } catch (error) {
          console.error("Error fetching liquidated positions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLiquidatePositions();
  }, [
    chainId,
    account,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
  ]);

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
        Liquidates
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
