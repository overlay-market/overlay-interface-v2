import { Flex, Text } from "@radix-ui/themes";
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
import {
  useIsNewUnwindTxn,
  usePositionRefresh,
} from "../../../state/portfolio/hooks";
import useMultiMarketPositionsPnL from "../../../hooks/useMultiMarketPositionsPnL";
import { triggerLoader } from "../UnwindsTable";
import { isShutdownOpenPosition } from "../../../utils/positionGuards";
import {
  CloseAllButton,
  PositionFilterChip,
  PositionsFilters,
  PositionsTitle,
  PositionsToolbar,
  PositionsToolbarLeft,
} from "../../../styles/positions-table";

import styled, { keyframes } from "styled-components";

// Loading spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${theme.color.grey4};
  border-top: 2px solid ${theme.color.green1};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const POSITIONS_COLUMNS = [
  "Contract",
  "Size",
  "Entry Price",
  "Mark Price",
  "Est. Liq. Price",
  "Break-Even Price",
  "Margin",
  "MMR",
  "Unrealized PnL (ROE)",
  "Realized P",
  "Reduce/Close",
];

const OpenPositionsTable: React.FC = () => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();
  const isNewUnwindTxn = useIsNewUnwindTxn();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set()
  );

  const getPositionKey = (position: OpenPositionData) => {
    return `${position.positionId}-${position.marketAddress}`;
  };
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [marginMode, setMarginMode] = useState<"all" | "cross" | "isolated">("all");

  const { loading, positions, positionsTotalNumber, refreshPositions } =
    usePositionRefresh(
      sdk,
      account,
      isNewTxnHash || isNewUnwindTxn,
      currentPage,
      itemsPerPage
    );

  const { pnlData, marketPrices } = useMultiMarketPositionsPnL(positions, {
    isRefreshing: loading,
  });
  const closeablePositions =
    positions?.filter((pos) => !isShutdownOpenPosition(pos)) || [];
  const selectedCloseablePositions =
    positions?.filter((pos) => selectedPositions.has(getPositionKey(pos))) || [];

  const handleCloseAll = () => {
    setSelectedPositions(new Set(closeablePositions.map(getPositionKey)));
    setShowCloseModal(true);
  };

  const handleClosePositions = async () => {
    setShowCloseModal(false);
    setSelectedPositions(new Set());
    triggerLoader && triggerLoader();
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
      <PositionsToolbar>
        <PositionsToolbarLeft>
          <PositionsTitle>Positions({positionsTotalNumber})</PositionsTitle>
          {loading && positions && <LoadingSpinner />}
          <PositionsFilters aria-label="Position margin mode filters">
            {(["all", "cross", "isolated"] as const).map((mode) => (
              <PositionFilterChip
                key={mode}
                type="button"
                $active={marginMode === mode}
                onClick={() => setMarginMode(mode)}
              >
                {mode === "all" ? "All" : mode === "cross" ? "Cross" : "Isolated"}
              </PositionFilterChip>
            ))}
          </PositionsFilters>
        </PositionsToolbarLeft>
        <CloseAllButton
          type="button"
          disabled={closeablePositions.length === 0}
          onClick={handleCloseAll}
        >
          Close All
        </CloseAllButton>
      </PositionsToolbar>

      <StyledTable
        headerColumns={POSITIONS_COLUMNS}
        variant="positions"
        minWidth="1360px"
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        positionsTotalNumber={positionsTotalNumber}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        body={
          positions && positions.length > 0 ? (
            <>
              {positions.map((pos) => {
                const key = getPositionKey(pos);
                return (
                  <OpenPosition
                    key={key}
                    position={pos}
                    realtimePnL={pnlData.get(
                      `${pos.marketAddress}-${pos.positionId}`
                    )}
                    realtimeMarketPrices={marketPrices.get(
                      pos.marketAddress.toLowerCase()
                    )}
                    showCheckbox={false}
                    isChecked={false}
                  />
                );
              })}
            </>
          ) : loading ? (
            <tr>
              <td
                colSpan={POSITIONS_COLUMNS.length}
                style={{ padding: "20px 0" }}
              >
                <Loader />
              </td>
            </tr>
          ) : account ? (
            <tr>
              <td
                colSpan={POSITIONS_COLUMNS.length}
                style={{ padding: "20px 0" }}
              >
                <Text>You have no open positions</Text>
              </td>
            </tr>
          ) : (
            <tr>
              <td
                colSpan={POSITIONS_COLUMNS.length}
                style={{ padding: "20px 0" }}
              >
                <Text style={{ color: theme.color.grey3 }}>
                  No wallet connected
                </Text>
              </td>
            </tr>
          )
        }
      />
      <ClosePositionsModal
        open={showCloseModal}
        handleDismiss={() => setShowCloseModal(false)}
        selectedCount={selectedCloseablePositions.length}
        selectedPositions={selectedCloseablePositions}
        onConfirm={handleClosePositions}
      />
    </Flex>
  );
};

export default OpenPositionsTable;
