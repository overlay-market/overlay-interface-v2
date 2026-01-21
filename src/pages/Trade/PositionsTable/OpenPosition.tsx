import { Flex, Text, Badge, Tooltip, Skeleton } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useMemo, useState } from "react";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { formatNumberWithCommas } from "../../../utils/formatPriceWithCurrency";
import { isGamblingMarket } from "../../../utils/marketGuards";

type OpenPositionProps = {
  position: OpenPositionData;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<OpenPositionData | null>(null);

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

  // Detect if this is an optimistic position (not yet confirmed by subgraph)
  const isOptimistic = position.positionId === -1;

  // For LBSC positions with stable values calculated:
  // Display stable values in USDT (both positive and negative PnL)
  const pnlValue = position.stableValues
    ? position.stableValues.unrealizedPnL
    : position.unrealizedPnL;
  const pnlToken = position.stableValues
    ? 'USDT'
    : 'OVL';
  const isPnLPositive = Number(position.unrealizedPnL) > 0;

  const currentSize = positionLeverage &&
    (
      position.stableValues?.initialCollateral
        ? formatNumberWithCommas((Number(position.stableValues.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' USDT'
        : formatNumberWithCommas((Number(position.initialCollateral) * Number(positionLeverage.slice(0, -1))) + Number(pnlValue)) + ' OVL'
    );

  const handleItemClick = () => {
    // Prevent clicking on zero-sized or optimistic positions
    if (position.size === "0" || position.positionId === -1) return;

    setSelectedPosition(position);
    setShowModal(true);
  };

  const isDoubleOrNothing = useMemo(
    () => isGamblingMarket(position.marketName),
    [position.marketName]
  );

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
        <StyledCell>
          {isDoubleOrNothing ? "-" : position.entryPrice}
        </StyledCell>
        <StyledCell>
          {isDoubleOrNothing ? "-" : position.liquidatePrice}
        </StyledCell>
        <StyledCell>
          <Skeleton loading={isOptimistic}>
            <Text
              style={{
                color: isPnLPositive ? theme.color.green1 : theme.color.red1,
              }}
            >
              {pnlValue} {pnlToken}
            </Text>
          </Skeleton>
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
