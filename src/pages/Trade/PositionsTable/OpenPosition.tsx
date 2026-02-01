import { Flex, Text, Badge, Tooltip } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useMemo, useState, useEffect, useRef } from "react";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { formatNumberWithCommas } from "../../../utils/formatPriceWithCurrency";
import { isGamblingMarket } from "../../../utils/marketGuards";
import { PositionPnLData } from "../../../hooks/usePositionsPnL";

type OpenPositionProps = {
  position: OpenPositionData;
  realtimePnL?: PositionPnLData;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position, realtimePnL }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<OpenPositionData | null>(null);

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

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

  const currentSize = positionLeverage &&
    (
      position.stableValues?.initialCollateral
        ? formatNumberWithCommas((Number(position.stableValues.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' USDT'
        : formatNumberWithCommas((Number(position.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' OVL'
    );

  const handleItemClick = () => {
    if (position.size === "0") return;

    setSelectedPosition(position);
    setShowModal(true);
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
          <Flex gap="6px" align="center">
            {currentSize}
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
        </StyledCell>
        <StyledCell>
          <Flex gap={"6px"}>
            {positionLeverage && Number(positionLeverage.slice(0, -1))}x
            <Text
              weight={"medium"}
              style={{ color: isLong ? theme.color.green1 : theme.color.red1 }}
            >
              {positionSide}
            </Text>
          </Flex>
        </StyledCell>
        <StyledCell>{isDoubleOrNothing ? "-" : position.entryPrice}</StyledCell>
        <StyledCell>{isDoubleOrNothing ? "-" : position.liquidatePrice}</StyledCell>
        <StyledCell>
          <Flex gap="4px" align="center">
            <Text
              style={{
                color: isPnLPositive ? theme.color.green1 : theme.color.red1,
                transition: "text-shadow 0.15s ease-out",
                textShadow: flashColor === "green"
                  ? `0 0 4px ${theme.color.green1}, 0 0 4px ${theme.color.green1}`
                  : flashColor === "red"
                  ? `0 0 4px ${theme.color.red1}, 0 0 4px ${theme.color.red1}`
                  : "none",
              }}
            >
              {pnlValue}
            </Text>
            <Text style={{ color: isPnLPositive ? theme.color.green1 : theme.color.red1 }}>
              {pnlToken}
            </Text>
          </Flex>
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
