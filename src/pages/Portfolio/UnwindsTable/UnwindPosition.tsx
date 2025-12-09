import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { UnwindPositionData } from "overlay-sdk";
type UnwindPositionProps = {
  position: UnwindPositionData;
};

const UnwindPosition: React.FC<UnwindPositionProps> = ({ position }) => {

  const [positionLeverage, positionSide] = position.positionSide
    ? position.positionSide.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.pnl) > 0;

  // Format collateral amount with correct decimals
  const collateralAmount = position.stableValues?.size
    ? `${position.stableValues.size} USDT`
    : `${position.size} OVL`;

  // For PnL - show USDT if loss, OVL if gain
  const pnl = position.stableValues
    ? `${position.stableValues.pnl} USDT`
    : `${position.pnl} OVL`

  return (
    <StyledRow style={{ fontSize: "12px", cursor: "default" }}>
        <StyledCell>{position.marketName}</StyledCell>
        <StyledCell>{collateralAmount}</StyledCell>
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
        <StyledCell>{position.exitPrice}</StyledCell>
        <StyledCell>{position.parsedCreatedTimestamp}</StyledCell>
        <StyledCell>{position.parsedClosedTimestamp}</StyledCell>
        <StyledCell>
          <Text
            style={{
              color: isPnLPositive ? theme.color.green1 : theme.color.red1,
            }}
          >
            {pnl}
          </Text>
        </StyledCell>
    </StyledRow>
  );
};

export default UnwindPosition;
