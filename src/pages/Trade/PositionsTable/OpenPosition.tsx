import { Flex, Text, Badge } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";
import { useState } from "react";
import PositionUnwindModal from "../../../components/PositionUnwindModal";

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
  const isPnLPositive = Number(position.unrealizedPnL) > 0;

  const handleItemClick = () => {
    setSelectedPosition(position);
    setShowModal(true);
  };

  return (
    <>
      <StyledRow onClick={handleItemClick}>
        <StyledCell>
          <Flex gap="6px" align="center">
            {position.size} OVL
            {position.deprecated && (
              <Badge color="orange" size="1">
                Deprecated
              </Badge>
            )}
          </Flex>
        </StyledCell>
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
        <StyledCell>{position.liquidatePrice}</StyledCell>
        <StyledCell>
          <Text
            style={{
              color: isPnLPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {position.unrealizedPnL} OVL
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
