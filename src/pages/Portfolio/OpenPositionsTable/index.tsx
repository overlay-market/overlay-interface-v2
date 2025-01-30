import { Flex, Text } from "@radix-ui/themes";
import { ColorButton } from "../../../components/Button";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useState } from "react";
import useAccount from "../../../hooks/useAccount";
import StyledTable from "../../../components/Table";
import OpenPosition from "./OpenPosition";
import { useIsNewTxnHash } from "../../../state/trade/hooks";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import type { OpenPositionData } from "overlay-sdk";
import ClosePositionsModal from "../../../components/ClosePositionsModal";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { usePositionRefresh } from "../../../state/portfolio/hooks";

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
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set()
  );
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");

  const { loading, positions, positionsTotalNumber, refreshPositions } =
    usePositionRefresh(sdk, account, isNewTxnHash, currentPage, itemsPerPage);

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedPositions(
        new Set(positions?.map((p) => p.positionId.toString()) || [])
      );
    } else {
      setSelectedPositions(new Set());
    }
  };

  const handlePositionSelect = (
    position: OpenPositionData,
    checked: boolean
  ) => {
    setSelectedPositions((prev) => {
      const newSet = new Set(prev);
      const positionId = position.positionId.toString();
      if (checked) {
        newSet.add(positionId);
      } else {
        newSet.delete(positionId);
      }
      return newSet;
    });
  };

  const handleClosePositions = async () => {
    setShowCloseModal(false);
    setShowCheckboxes(false);
    setSelectedPositions(new Set());
    setTimeout(refreshPositions, 1000);
  };

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
      <Flex align="center" justify="between" mb="4">
        <Text weight={"bold"} size={"5"}>
          Open Positions
        </Text>
        <Flex gap="2" style={{ display: isMobile ? "none" : "flex" }}>
          {showCheckboxes ? (
            <>
              <ColorButton
                onClick={() => {
                  setShowCheckboxes(false);
                  setSelectedPositions(new Set());
                }}
                width="140px"
                bgColor={theme.color.grey4}
                color={theme.color.grey1}
              >
                Cancel Selection
              </ColorButton>
              <ColorButton
                onClick={() => setShowCloseModal(true)}
                width="180px"
                disabled={selectedPositions.size === 0}
              >
                Close Selected ({selectedPositions.size})
              </ColorButton>
            </>
          ) : (
            <ColorButton
              onClick={() => setShowCheckboxes(true)}
              width="140px"
              style={{ display: positionsTotalNumber === 0 ? "none" : "block" }}
            >
              Select Positions
            </ColorButton>
          )}
        </Flex>
      </Flex>

      <StyledTable
        headerColumns={POSITIONS_COLUMNS}
        minWidth="950px"
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        positionsTotalNumber={positionsTotalNumber}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        showCheckbox={showCheckboxes}
        onSelectAll={handleSelectAll}
        body={
          loading ? (
            <tr>
              <td
                colSpan={POSITIONS_COLUMNS.length}
                style={{ padding: "20px 0" }}
              >
                <Loader />
              </td>
            </tr>
          ) : (
            positions &&
            positions.map((position: OpenPositionData) => (
              <OpenPosition
                position={position}
                key={position.positionId}
                showCheckbox={showCheckboxes}
                onCheckboxChange={(checked) =>
                  handlePositionSelect(position, checked)
                }
                isChecked={selectedPositions.has(
                  position.positionId.toString()
                )}
              />
            ))
          )
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

      <ClosePositionsModal
        open={showCloseModal}
        handleDismiss={() => setShowCloseModal(false)}
        selectedCount={selectedPositions.size}
        selectedPositions={
          positions?.filter((pos) =>
            selectedPositions.has(pos.positionId.toString())
          ) || []
        }
        onConfirm={handleClosePositions}
      />
    </Flex>
  );
};

export default OpenPositionsTable;
