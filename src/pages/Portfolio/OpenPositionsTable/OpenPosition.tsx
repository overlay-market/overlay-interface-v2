import { Flex, Text, Checkbox, Badge, Tooltip } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { useState } from "react";
import { OpenPositionData } from "overlay-sdk";
import { useChainId } from "wagmi";
import { SUPPORTED_CHAINID } from "../../../constants/chains";

type OpenPositionProps = {
  position: OpenPositionData;
  showCheckbox?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  isChecked?: boolean;
};

const OpenPosition: React.FC<OpenPositionProps> = ({
  position,
  showCheckbox = true,
  onCheckboxChange,
  isChecked = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<OpenPositionData | null>(null);
  const chainId = useChainId();

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.unrealizedPnL) > 0;
  const isFundingPositive = Number(position.parsedFunding) > 0;
  const hasLoan = Boolean(position.loan);

  // Format collateral amount
  // Testnet mock USDT has 18 decimals, mainnet USDT has 6 decimals
  const stableDecimals = chainId === SUPPORTED_CHAINID.BSC_TESTNET ? 18 : 6;
  const collateralAmount = hasLoan && position.loan
    ? `${(Number(position.loan.stableAmount) / 10 ** stableDecimals).toFixed(2)} USDT`
    : `${position.size} OVL`;

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
            {hasLoan ? (
              <Tooltip
                content="USDT positions cannot be batch-closed. Close individually at 100%."
                style={{ background: theme.tooltip.background, borderRadius: theme.tooltip.borderRadius, padding: theme.tooltip.padding }}
              >
                <Checkbox
                  checked={false}
                  disabled={true}
                  size="3"
                  onClick={(e) => e.stopPropagation()}
                  style={{ cursor: 'not-allowed' }}
                />
              </Tooltip>
            ) : (
              <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
                size="3"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </StyledCell>
        )}
        <StyledCell>
          <Flex gap="6px" align="center">
            {position.marketName}
            {hasLoan && (
              <Tooltip
                content="Position built with USDT collateral. Must be fully unwound (100%) individually."
                style={{ background: theme.tooltip.background, borderRadius: theme.tooltip.borderRadius, padding: theme.tooltip.padding }}
              >
                <Badge size="1" style={{ cursor: "help", backgroundColor: 'rgba(255, 193, 7, 0.2)', color: theme.color.yellow1, border: `1px solid ${theme.color.yellow1}` }}>
                  USDT
                </Badge>
              </Tooltip>
            )}
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
        <StyledCell>{collateralAmount}</StyledCell>
        <StyledCell>
          <Flex gap={"6px"}>
            {positionLeverage}
            <Text
              weight={"medium"}
              style={{ color: isLong ? theme.color.green1 : theme.color.red1 }}
            >
              {positionSide}
            </Text>
          </Flex>
        </StyledCell>
        <StyledCell>{position.entryPrice}</StyledCell>
        <StyledCell>{position.currentPrice}</StyledCell>
        <StyledCell>{position.liquidatePrice}</StyledCell>
        <StyledCell>{position.parsedCreatedTimestamp}</StyledCell>
        <StyledCell>
          <Text
            style={{
              color: isPnLPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {position.unrealizedPnL} OVL
          </Text>
        </StyledCell>
        <StyledCell>
          <Text
            style={{
              color: isFundingPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {position.parsedFunding} OVL
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
