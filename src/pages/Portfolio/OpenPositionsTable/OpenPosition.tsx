import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { useState } from "react";
import { OpenPositionData } from "overlay-sdk";

type OpenPositionProps = {
  position: OpenPositionData;
  showCheckbox?: boolean;
  onCheckboxChange?: (positionId: string, checked: boolean) => void;
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
    if ((event.target as HTMLElement).tagName !== "INPUT") {
      setSelectedPosition(position);
      setShowModal(true);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;
    if (onCheckboxChange) {
      onCheckboxChange(position.marketAddress, newCheckedState);
    }
  };

  return (
    <>
      <StyledRow style={{ fontSize: "12px" }} onClick={handleItemClick}>
        {showCheckbox && (
          <StyledCell>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
            />
          </StyledCell>
        )}
        <StyledCell>{position.marketName}</StyledCell>
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
