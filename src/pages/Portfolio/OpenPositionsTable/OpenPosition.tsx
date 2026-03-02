import { Flex, Text, Checkbox, Badge, Tooltip } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { useMemo, useState, useEffect, useRef } from "react";
import { OpenPositionData } from "overlay-sdk";
import { formatUnits } from "viem";
import { formatNumberWithCommas } from "../../../utils/formatPriceWithCurrency";
import { isGamblingMarket } from "../../../utils/marketGuards";
import type { PositionPnLEntry, MarketPrices } from "../../../hooks/useMultiMarketPositionsPnL";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";

type OpenPositionProps = {
  position: OpenPositionData;
  realtimePnL?: PositionPnLEntry;
  realtimeMarketPrices?: MarketPrices;
  showCheckbox?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  isChecked?: boolean;
};

const OpenPosition: React.FC<OpenPositionProps> = ({
  position,
  realtimePnL,
  realtimeMarketPrices,
  showCheckbox = true,
  onCheckboxChange,
  isChecked = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<OpenPositionData | null>(null);

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

  // Use real-time PnL if available, with fallback chain:
  // realtimePnL.pnlUSDT → realtimePnL.pnlFormatted → SDK static values
  const isLBSC = !!position.stableValues;

  const pnlValue = realtimePnL?.pnlUSDT
    ? realtimePnL.pnlUSDT
    : realtimePnL && !isLBSC
    ? realtimePnL.pnlFormatted.toFixed(2)
    : position.stableValues
    ? position.stableValues.unrealizedPnL
    : position.unrealizedPnL;

  const pnlToken = position.stableValues ? "USDT" : "OVL";

  const isPnLPositive = realtimePnL
    ? realtimePnL.pnlUSDT
      ? Number(realtimePnL.pnlUSDT) > 0
      : realtimePnL.pnlFormatted > 0
    : Number(position.unrealizedPnL) > 0;

  const fundingRawValue = position.stableValues
    ? position.stableValues.funding
    : position.parsedFunding;
  const fundingValue = Number(fundingRawValue).toFixed(2);
  const fundingToken = position.stableValues
    ? 'USDT'
    : 'OVL';
  const isFundingPositive = Number(position.parsedFunding) > 0;

  // Flash effect for PnL changes
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);
  const prevPnLRef = useRef<number | undefined>();

  useEffect(() => {
    const currentNum = Number(pnlValue);
    const prevNum = prevPnLRef.current;

    prevPnLRef.current = isNaN(currentNum) ? undefined : currentNum;

    if (prevNum === undefined || isNaN(currentNum) || currentNum === prevNum) {
      return;
    }

    setFlashColor(currentNum > prevNum ? "green" : "red");
    const timer = setTimeout(() => setFlashColor(null), 150);
    return () => clearTimeout(timer);
  }, [pnlValue]);

  // Use real-time mid price if available, fall back to SDK static value
  // Uses formatUnits for precision-safe bigint→string, and toFixed(4) to match SDK formatting
  const currentPrice = useMemo(() => {
    if (realtimeMarketPrices?.mid) {
      const midFormatted = formatUnits(realtimeMarketPrices.mid, 18);
      const midNum = parseFloat(midFormatted);
      if (midNum > 0) {
        return formatPriceWithCurrency(midNum.toFixed(4), position.priceCurrency);
      }
    }
    return position.currentPrice;
  }, [realtimeMarketPrices?.mid, position.currentPrice, position.priceCurrency]);

  const currentSize = positionLeverage &&
    (
      position.stableValues?.initialCollateral
        ? formatNumberWithCommas((Number(position.stableValues.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' USDT'
        : formatNumberWithCommas((Number(position.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' OVL'
    );

  const isDoubleOrNothing = useMemo(
    () => isGamblingMarket(position.marketName),
    [position.marketName]
  );

  const handleItemClick = (event: React.MouseEvent) => {
    if (position.size === "0") return;

    if ((event.target as HTMLElement).tagName !== "INPUT") {
      setSelectedPosition(position);
      setShowModal(true);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onCheckboxChange) {
      onCheckboxChange(checked);
    }
  };

  return (
    <>
      <StyledRow style={{ fontSize: "12px" }} onClick={handleItemClick}>
        {showCheckbox && (
          <StyledCell
            style={{
              width: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={handleCheckboxChange}
              size="3"
              onClick={(e) => e.stopPropagation()}
            />
          </StyledCell>
        )}
        <StyledCell>
          <Flex gap="6px" align="center">
            {position.marketName}
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
        <StyledCell>{currentSize}</StyledCell>
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
        <StyledCell>{isDoubleOrNothing ? "-" : currentPrice}</StyledCell>
        <StyledCell>{isDoubleOrNothing ? "-" : position.liquidatePrice}</StyledCell>
        <StyledCell>{position.parsedCreatedTimestamp}</StyledCell>
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
        <StyledCell>
          <Text
            style={{
              color: isFundingPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {fundingValue} {fundingToken}
          </Text>
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
