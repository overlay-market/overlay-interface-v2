import { Flex, Text } from "@radix-ui/themes";
import { StyledCell, StyledRow } from "../../../components/Table";
import theme from "../../../theme";
import { LiquidatedPositionData } from "overlay-sdk";
import { useStableTokenInfo } from "../../../hooks/useStableTokenInfo";
import { formatUnits } from "viem";

type LiquidatedPositionProps = {
  position: LiquidatedPositionData;
};

const LiquidatedPosition: React.FC<LiquidatedPositionProps> = ({
  position,
}) => {
  const { data: stableTokenInfo } = useStableTokenInfo();
  const hasLoan = Boolean(position.loan);

  const [positionLeverage, positionSide] = position.position
    ? position.position.split(" ")
    : [undefined, undefined];
  const isLong = positionSide === "Long";

  // Format collateral amount with correct decimals
  const stableDecimals = stableTokenInfo?.decimals ?? 18;
  const collateralAmount = hasLoan && position.loan
    ? `${Number(formatUnits(BigInt(position.loan.stableAmount), stableDecimals)).toFixed(2)} USDT`
    : `${position.size} OVL`;

  return (
    <StyledRow style={{ fontSize: "12px", cursor: "auto" }}>
      <StyledCell>{position.marketName}</StyledCell>
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
      <StyledCell>{position.exitPrice}</StyledCell>
      <StyledCell>{position.created}</StyledCell>
      <StyledCell>{position.liquidated}</StyledCell>
    </StyledRow>
  );
};

export default LiquidatedPosition;
