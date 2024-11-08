import { Flex, Text } from "@radix-ui/themes";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../hooks/useSDK";
import { useEffect, useState } from "react";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import { Address } from "viem";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import UnwindPosition from "./UnwindPosition";
import { UnwindPositionData } from "overlay-sdk";

const UNWIND_POSITIONS_COLUMNS = [
  "Market",
  "Size",
  "Position",
  "Entry Price",
  "Exit Price",
  "Created",
  "Closed",
  "PnL",
];

const UnwindsTable: React.FC = () => {
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const [loading, setLoading] = useState<boolean>(false);
  const [unwindPositions, setUnwindPositions] = useState<
    UnwindPositionData[] | undefined
  >(undefined);
  const [positionsTotalNumber, setPositionsTotalNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUnwindPositions = async () => {
      if (!account) {
        setUnwindPositions(undefined);
        setPositionsTotalNumber(0);
      }

      if (account) {
        setLoading(true);
        try {
          const unwinds = await sdk.unwindPositions.transformUnwindPositions(
            currentPage,
            itemsPerPage,
            undefined,
            account as Address
          );

          unwinds && setUnwindPositions(unwinds.data);
          if (!unwinds) {
            setUnwindPositions(undefined);
            setPositionsTotalNumber(0);
          }
          const positionsLength = unwinds && unwinds.total;
          positionsLength && setPositionsTotalNumber(positionsLength);
        } catch (error) {
          console.error("Error fetching unwind positions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUnwindPositions();
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
      px={"8px"}
      pt={"16px"}
      pb={"66px"}
      width={"100%"}
      style={{
        borderBottom: `1px solid ${theme.color.darkBlue}`,
      }}
    >
      <Text weight={"bold"} size={"5"}>
        Unwinds
      </Text>

      <StyledTable
        headerColumns={UNWIND_POSITIONS_COLUMNS}
        minWidth="950px"
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        positionsTotalNumber={positionsTotalNumber}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        body={
          unwindPositions &&
          unwindPositions.map((position: UnwindPositionData, index: number) => (
            <UnwindPosition position={position} key={index} />
          ))
        }
      />

      {loading && !unwindPositions ? (
        <Loader />
      ) : account ? (
        unwindPositions &&
        positionsTotalNumber === 0 && <Text>You have no unwind positions</Text>
      ) : (
        <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
      )}
    </Flex>
  );
};

export default UnwindsTable;
