import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { OpenPositionData } from "overlay-sdk";

type OpenPositionProps = {
  position: OpenPositionData;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position }) => {
  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.unrealizedPnL) > 0;

  return (
    <StyledRow>
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
  );
};

export default OpenPosition;
