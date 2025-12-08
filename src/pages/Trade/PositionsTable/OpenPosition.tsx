import { Flex, Text, Badge, Tooltip } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useState } from "react";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { useStableTokenInfo } from "../../../hooks/useStableTokenInfo";
import { formatUnits } from "viem";

type OpenPositionProps = {
  position: OpenPositionData;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position }) => {
  const { data: stableTokenInfo } = useStableTokenInfo();
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<OpenPositionData | null>(null);

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

  // For LBSC positions with stable values calculated:
  // Display stable values in USDT (both positive and negative PnL)
  const pnlValue = position.stableValues
    ? position.stableValues.unrealizedPnL
    : position.unrealizedPnL;
  const pnlToken = position.stableValues
    ? 'USDT'
    : 'OVL';
  const isPnLPositive = Number(position.unrealizedPnL) > 0;

  // Format collateral amount with correct decimals
  const stableDecimals = stableTokenInfo?.decimals ?? 18;
  const collateralAmount = position.loan
    ? `${Number(formatUnits(BigInt(position.loan.stableAmount), stableDecimals)).toFixed(2)} USDT`
    : `${position.size} OVL`;

  const handleItemClick = () => {
    if (position.size === "0") return;

    setSelectedPosition(position);
    setShowModal(true);
  };

  return (
    <>
      <StyledRow onClick={handleItemClick}>
        <StyledCell>
          <Flex gap="6px" align="center">
            {collateralAmount}
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
        <StyledCell>{position.entryPrice}</StyledCell>
        <StyledCell>{position.liquidatePrice}</StyledCell>
        <StyledCell>
          <Text
            style={{
              color: isPnLPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {pnlValue} {pnlToken}
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
