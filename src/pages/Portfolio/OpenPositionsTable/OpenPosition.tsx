import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "../../../types/positionTypes";
import PositionUnwindModal from "../../../components/PositionUnwindModal";
import { useState } from "react";

type OpenPositionProps = {
  position: OpenPositionData;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position }) => {
  const [showModal, setShowModal] = useState(false);

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.unrealizedPnL) > 0;
  const isFundingPositive = Number(position.parsedFunding) > 0;

  return (
    <>
      <StyledRow
        style={{ fontSize: "12px" }}
        onClick={() => setShowModal(true)}
      >
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

      <PositionUnwindModal
        open={showModal}
        position={position}
        handleDismiss={() => setShowModal(false)}
      />
    </>
  );
};

export default OpenPosition;
