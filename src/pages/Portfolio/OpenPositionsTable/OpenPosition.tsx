import { Flex, Text, Checkbox, Badge, Tooltip } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { useState } from "react";
import { OpenPositionData } from "overlay-sdk";

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

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.unrealizedPnL) > 0;
  const isFundingPositive = Number(position.parsedFunding) > 0;

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
        <StyledCell>{position.size} OVL</StyledCell>
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
