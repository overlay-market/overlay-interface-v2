import { Flex, Text } from "@radix-ui/themes";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useState } from "react";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import type { Address } from "viem";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import UnwindPosition from "./UnwindPosition";
import type { UnwindPositionData } from "overlay-sdk";
import { useUnwindPositionRefresh } from "../../../state/portfolio/hooks";

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
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { loading, unwindPositions, unwindPositionsTotalNumber } =
    useUnwindPositionRefresh(
      sdk,
      account as Address | undefined,
      isNewTxnHash,
      currentPage,
      itemsPerPage
    );

  return (
    <Flex
      direction={"column"}
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
        positionsTotalNumber={unwindPositionsTotalNumber}
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
        unwindPositionsTotalNumber === 0 && (
          <Text>You have no unwind positions</Text>
        )
      ) : (
        <Text style={{ color: theme.color.grey3 }}>No wallet connected</Text>
      )}
    </Flex>
  );
};

export default UnwindsTable;
