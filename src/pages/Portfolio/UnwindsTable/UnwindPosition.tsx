import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { useState } from "react";
import ClosedPositionModal from "./ClosedPositionModal";
import { UnwindPositionData } from "overlay-sdk";

type UnwindPositionProps = {
  position: UnwindPositionData;
};

const UnwindPosition: React.FC<UnwindPositionProps> = ({ position }) => {
  const [showModal, setShowModal] = useState(false);
  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.pnl) > 0;

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
        <StyledCell>{position.exitPrice}</StyledCell>
        <StyledCell>{position.parsedCreatedTimestamp}</StyledCell>
        <StyledCell>{position.parsedClosedTimestamp}</StyledCell>
        <StyledCell>
          <Text
            style={{
              color: isPnLPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {position.pnl} OVL
          </Text>
        </StyledCell>
      </StyledRow>

      <ClosedPositionModal
        open={showModal}
        position={position}
        handleDismiss={() => setShowModal(false)}
      />
    </>
  );
};

export default UnwindPosition;
