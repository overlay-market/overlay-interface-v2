import { Text } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { getZeroValuePositions } from "../../../utils/getZeroValuePositions";
import { SHIVA_ADDRESS } from "../../../constants/applications";

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

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  const fetchPositions = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      if (!account || !marketId) {
        setPositions(undefined);
        setPositionsTotalNumber(0);
        return false;
      }

      try {
        const result =
          await sdkRef.current.openPositions.transformOpenPositions(
            currentPage,
            itemsPerPage,
            marketId,
            account as Address,
            isNewTxnHash
          );

        if (!result || !result.data) {
          throw new Error("No position data received");
        }

        const validPositions = result.data.filter((pos: OpenPositionData) => {
          return (
            pos &&
            pos.marketName &&
            pos.size &&
            pos.positionSide &&
            pos.entryPrice &&
            pos.currentPrice &&
            pos.liquidatePrice &&
            pos.parsedCreatedTimestamp
          );
        });

        const invalidPositionsWithMarket = result.data.filter(
          (pos: OpenPositionData) =>
            pos && pos.marketAddress && !(pos.size && pos.liquidatePrice)
        );

        let zeroValuePositions: OpenPositionData[] = [];

        if (invalidPositionsWithMarket.length > 0) {
          zeroValuePositions = await getZeroValuePositions(
            sdkRef.current.core,
            invalidPositionsWithMarket,
            SHIVA_ADDRESS[sdkRef.current.core.chainId].toLowerCase() as Address
          );
        }

        const allValidPositions = [...validPositions, ...zeroValuePositions];
        allValidPositions.sort((a, b) => {
          const dateA = new Date(a.parsedCreatedTimestamp ?? "").getTime();
          const dateB = new Date(b.parsedCreatedTimestamp ?? "").getTime();
          return dateB - dateA;
        });

        setPositions(allValidPositions);
        setPositionsTotalNumber(result.total ?? allValidPositions.length);

        return true;
      } catch (error) {
        console.error("Error fetching positions:", error);
        if (retryCount < 2) {
          console.warn("Retrying fetchPositions...");
          return fetchPositions(retryCount + 1);
        }
        return false;
      }
    },
    [account, currentPage, itemsPerPage, marketId, isNewTxnHash]
  );

  useEffect(() => {
    if (!sdkRef.current || !chainId) return;

    setLoading(true);
    fetchPositions().finally(() => setLoading(false));
  }, [fetchPositions, chainId]);

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
