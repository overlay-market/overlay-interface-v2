import { Flex, Badge, Tooltip, Skeleton } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useMemo, useState, useEffect, useRef } from "react";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import {
  formatNumberWithCommas,
  formatPriceWithCurrency,
} from "../../../utils/formatPriceWithCurrency";
import { isGamblingMarket } from "../../../utils/marketGuards";
import { isShutdownOpenPosition } from "../../../utils/positionGuards";
import type {
  MarketPrices,
  PositionPnLEntry,
} from "../../../hooks/useMultiMarketPositionsPnL";
import { formatUnits } from "viem";
import {
  CellStack,
  CellValue,
  ContractMeta,
  ContractName,
  ContractStack,
  MetaBadge,
  MutedCellValue,
  PositionActionButton,
  PositionActionGroup,
  SideBadge,
} from "../../../styles/positions-table";

type OpenPositionProps = {
  position: OpenPositionData;
  realtimePnL?: PositionPnLEntry;
  realtimeMarketPrices?: MarketPrices;
};

const OpenPosition: React.FC<OpenPositionProps> = ({
  position,
  realtimePnL,
  realtimeMarketPrices,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<OpenPositionData | null>(null);

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

  // Detect if this is an optimistic position (not yet confirmed by subgraph)
  const isOptimistic = position.positionId === -1;

  // Use real-time PnL if available
  // For LBSC positions, use the converted USDT value from realtime updates
  // Otherwise fall back to SDK's calculated values
  const isLBSC = !!position.stableValues;

  const pnlValue = realtimePnL?.pnlUSDT
    ? realtimePnL.pnlUSDT // Real-time USDT PnL for LBSC
    : realtimePnL && !isLBSC
    ? realtimePnL.pnlFormatted.toFixed(2) // Real-time OVL PnL
    : position.stableValues
    ? position.stableValues.unrealizedPnL // Fallback: SDK's USDT PnL
    : position.unrealizedPnL; // Fallback: SDK's OVL PnL

  const pnlToken = position.stableValues ? "USDT" : "OVL";

  const isPnLPositive = realtimePnL
    ? realtimePnL.pnlUSDT
      ? Number(realtimePnL.pnlUSDT) > 0
      : realtimePnL.pnlFormatted > 0
    : Number(position.unrealizedPnL) > 0;

  const fundingRawValue = position.stableValues
    ? position.stableValues.funding
    : position.parsedFunding;
  const fundingNumber = Number(fundingRawValue ?? 0);
  const fundingValue = fundingNumber.toFixed(2);
  const fundingToken = position.stableValues ? "USDT" : "OVL";
  const isFundingPositive = fundingNumber > 0;
  const collateralValue = position.stableValues?.initialCollateral
    ? position.stableValues.initialCollateral
    : position.initialCollateral;
  const collateralNumber = Number(String(collateralValue ?? 0).replace(/,/g, ""));
  const collateralToken = position.stableValues ? "USDT" : "OVL";
  const marginValue = `${formatNumberWithCommas(collateralNumber)} ${collateralToken}`;
  const numericPnl = Number(String(pnlValue ?? 0).replace(/,/g, ""));
  const roeValue = collateralNumber > 0
    ? `${((numericPnl / collateralNumber) * 100).toFixed(2)}%`
    : "0.00%";
  // TODO: Replace LOREM IPSUM when the SDK exposes maintenance margin ratio per open position.
  const mmrValue = "LOREM IPSUM";
  // TODO: Replace LOREM IPSUM when open-position realized PnL is available in the SDK response.
  const realizedPnlValue = "LOREM IPSUM";

  const currentSize = positionLeverage
    ? (
        position.stableValues?.initialCollateral
          ? formatNumberWithCommas((Number(position.stableValues.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' USDT'
          : formatNumberWithCommas((Number(position.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' OVL'
      )
    : "-";

  const currentPrice = useMemo(() => {
    if (realtimeMarketPrices?.mid) {
      const midFormatted = formatUnits(realtimeMarketPrices.mid, 18);
      const midNum = parseFloat(midFormatted);

      if (midNum > 0) {
        return formatPriceWithCurrency(
          midNum.toFixed(4),
          position.priceCurrency
        );
      }
    }

    return position.currentPrice;
  }, [realtimeMarketPrices?.mid, position.currentPrice, position.priceCurrency]);

  const isShutdownPosition = isShutdownOpenPosition(position);
  const displayedSize = isShutdownPosition ? "-" : currentSize;

  const handleItemClick = () => {
    // Shutdown rows use size=0 in the SDK, but still need to open the withdraw flow.
    if ((position.size === "0" && !isShutdownPosition) || position.positionId === -1) return;

    setSelectedPosition(position);
    setShowModal(true);
  };

  const handleReduceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleItemClick();
  };

  const isDoubleOrNothing = useMemo(
    () => isGamblingMarket(position.marketName),
    [position.marketName]
  );

  // Flash effect for PnL changes
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);
  const prevPnLRef = useRef<number | undefined>();

  useEffect(() => {
    const currentNum = Number(pnlValue);
    const prevNum = prevPnLRef.current;

    // Update ref first to avoid stale comparisons
    prevPnLRef.current = isNaN(currentNum) ? undefined : currentNum;

    // Skip if no valid previous value or values are equal
    if (prevNum === undefined || isNaN(currentNum) || currentNum === prevNum) {
      return;
    }

    // Trigger flash
    setFlashColor(currentNum > prevNum ? "green" : "red");

    // Clear flash after 150ms
    const timer = setTimeout(() => setFlashColor(null), 150);
    return () => clearTimeout(timer);
  }, [pnlValue]);

  return (
    <>
      <StyledRow onClick={handleItemClick}>
        <StyledCell>
          <ContractStack $long={isLong}>
            <Flex gap="6px" align="center">
              <ContractName>{position.marketName}</ContractName>
            {position.deprecated && (
              <Tooltip
                content="This position was built on a deprecated version of the market. You can still unwind it."
                style={{ background: theme.tooltip.background, borderRadius: theme.tooltip.borderRadius, padding: theme.tooltip.padding }}
              >
                <Badge color="orange" size="1" style={{ cursor: "help" }}>
                  Deprecated
                </Badge>
              </Tooltip>
            )}
            </Flex>
            <ContractMeta>
              <SideBadge $long={isLong}>{positionSide}</SideBadge>
              <MetaBadge>Cross</MetaBadge>
              <MetaBadge>{positionLeverage && Number(positionLeverage.slice(0, -1))}x</MetaBadge>
            </ContractMeta>
          </ContractStack>
        </StyledCell>
        <StyledCell>
          <CellValue>{displayedSize}</CellValue>
        </StyledCell>
        <StyledCell>
          <CellValue>{isDoubleOrNothing ? "-" : position.entryPrice}</CellValue>
        </StyledCell>
        <StyledCell>
          <CellValue>{isDoubleOrNothing ? "-" : currentPrice}</CellValue>
        </StyledCell>
        <StyledCell>
          <CellValue $accent="warning">
            {isDoubleOrNothing ? "-" : position.liquidatePrice}
          </CellValue>
        </StyledCell>
        <StyledCell>
          <CellValue>{isDoubleOrNothing ? "-" : position.entryPrice}</CellValue>
        </StyledCell>
        <StyledCell>
          <CellValue>{marginValue}</CellValue>
        </StyledCell>
        <StyledCell>
          <CellValue $accent="warning">{mmrValue}</CellValue>
        </StyledCell>
        <StyledCell>
          <Skeleton loading={isOptimistic}>
            <CellStack>
              <CellValue
                $accent={isPnLPositive ? "positive" : "negative"}
                style={{
                  textShadow: flashColor === "green"
                    ? `0 0 4px ${theme.color.green1}, 0 0 4px ${theme.color.green1}`
                    : flashColor === "red"
                      ? `0 0 4px ${theme.color.red1}, 0 0 4px ${theme.color.red1}`
                      : "none",
                }}
              >
                {pnlValue} {pnlToken} ({roeValue})
              </CellValue>
              <MutedCellValue>{pnlValue} {pnlToken}</MutedCellValue>
            </CellStack>
          </Skeleton>
        </StyledCell>
        <StyledCell>
          <CellStack>
            <CellValue $accent={isFundingPositive ? "positive" : "negative"}>
              {realizedPnlValue}
            </CellValue>
            <MutedCellValue>{fundingValue} {fundingToken}</MutedCellValue>
          </CellStack>
        </StyledCell>
        <StyledCell>
          <PositionActionGroup>
            <PositionActionButton type="button" onClick={handleReduceClick}>
              Limit
            </PositionActionButton>
            <PositionActionButton type="button" $primary onClick={handleReduceClick}>
              Market
            </PositionActionButton>
          </PositionActionGroup>
        </StyledCell>
      </StyledRow>

      {selectedPosition && (
        <PositionUnwindModal
          open={showModal}
          position={selectedPosition}
          handleDismiss={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default OpenPosition;
