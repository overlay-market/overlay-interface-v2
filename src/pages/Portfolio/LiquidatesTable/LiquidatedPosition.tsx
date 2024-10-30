import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { LiquidatedPositionData } from "../../../types/positionTypes";

type LiquidatedPositionProps = {
  position: LiquidatedPositionData;
};

const LiquidatedPosition: React.FC<LiquidatedPositionProps> = ({
  position,
}) => {
  const [positionLeverage, positionSide] = position.position
    ? position.position.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

  return (
    <StyledRow style={{ fontSize: "12px" }}>
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
      <StyledCell>{position.created}</StyledCell>
      <StyledCell>{position.liquidated}</StyledCell>
    </StyledRow>
  );
};

export default LiquidatedPosition;
