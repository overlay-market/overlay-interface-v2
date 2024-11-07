import { Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import { SuccessUnwindStateData } from "../../../types/tradeStateTypes";
import { OpenPositionData } from "../../../types/positionTypes";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import theme from "../../../theme";
import DetailRow from "../../Modal/DetailRow";
import { UNIT } from "../../../constants/applications";
import { ScrollContentWrapper } from "./unwind-position-details-styles";

type UnwindPositionDetailsProps = {
  position: OpenPositionData;
  unwindState: SuccessUnwindStateData;
};

const UnwindPositionDetails: React.FC<UnwindPositionDetailsProps> = ({
  position,
  unwindState,
}) => {
  const {
    pnl,
    side,
    value,
    oi,
    leverage,
    debt,
    cost,
    currentCollateral,
    currentNotional,
    initialCollateral,
    initialNotional,
    maintenanceMargin,
    entryPrice,
    currentPrice,
    estimatedReceivedPrice,
    priceImpact,
    liquidationPrice,
    isLong,
  } = useMemo(() => {
    const pnl = unwindState.pnl
      ? Number(unwindState.pnl).toString()
      : undefined;
    const side = unwindState.side ?? undefined;
    const value = unwindState.value
      ? Number(unwindState.value).toString()
      : undefined;
    const oi = unwindState.oi ? Number(unwindState.oi).toString() : undefined;
    const leverage = unwindState.leverage ?? undefined;
    const debt = unwindState.debt
      ? Number(unwindState.debt).toString()
      : undefined;
    const cost = unwindState.cost
      ? Number(unwindState.cost).toString()
      : undefined;
    const currentCollateral = unwindState.currentCollateral
      ? Number(unwindState.currentCollateral).toString()
      : undefined;
    const currentNotional = unwindState.currentNotional
      ? Number(unwindState.currentNotional).toString()
      : undefined;
    const initialCollateral = unwindState.initialCollateral
      ? Number(unwindState.initialCollateral).toString()
      : undefined;
    const initialNotional = unwindState.initialNotional
      ? Number(unwindState.initialNotional).toString()
      : undefined;
    const maintenanceMargin = unwindState.maintenanceMargin
      ? Number(unwindState.maintenanceMargin).toString()
      : undefined;
    const entryPrice = unwindState.entryPrice
      ? formatPriceByCurrency(
          unwindState.entryPrice as string,
          position.priceCurrency
        )
      : undefined;
    const currentPrice = unwindState.currentPrice
      ? formatPriceByCurrency(
          unwindState.currentPrice as string,
          position.priceCurrency
        )
      : undefined;
    const estimatedReceivedPrice = unwindState.estimatedReceivedPrice
      ? formatPriceByCurrency(
          unwindState.estimatedReceivedPrice as string,
          position.priceCurrency
        )
      : undefined;
    const priceImpact = unwindState.priceImpact
      ? Number(unwindState.priceImpact).toString()
      : undefined;
    const liquidationPrice = unwindState.liquidationPrice
      ? formatPriceByCurrency(
          unwindState.liquidationPrice as string,
          position.priceCurrency
        )
      : undefined;
    const isLong = side === "Long";

    return {
      pnl,
      side,
      value,
      oi,
      leverage,
      debt,
      cost,
      currentCollateral,
      currentNotional,
      initialCollateral,
      initialNotional,
      maintenanceMargin,
      entryPrice,
      currentPrice,
      estimatedReceivedPrice,
      priceImpact,
      liquidationPrice,
      isLong,
    };
  }, [unwindState]);

  return (
    <ScrollContentWrapper>
      <Flex direction={"column"} width={"100%"}>
        <DetailRow
          detail={"Profit/Loss"}
          value={`${pnl} ${UNIT}`}
          valueColor={
            Number(pnl) === 0
              ? ""
              : Number(pnl) > 0
              ? theme.color.green1
              : theme.color.red1
          }
        />
        <DetailRow
          detail={"Side"}
          value={side}
          valueColor={isLong ? theme.color.green1 : theme.color.red1}
        />
      </Flex>
      <Flex direction={"column"} width={"100%"} mt={"30px"}>
        <DetailRow detail={"Value"} value={`${value} ${UNIT}`} />
        <DetailRow detail={"Open Interest"} value={oi} />
        <DetailRow detail={"Leverage"} value={`${leverage}x`} />
        <DetailRow detail={"Debt"} value={`${debt} ${UNIT}`} />
        <DetailRow detail={"Cost"} value={`${cost} ${UNIT}`} />
        <DetailRow
          detail={"Current Collateral"}
          value={`${currentCollateral} ${UNIT}`}
        />
        <DetailRow
          detail={"Current Notional"}
          value={`${currentNotional} ${UNIT}`}
        />
        <DetailRow
          detail={"Initial Collateral"}
          value={`${initialCollateral} ${UNIT}`}
        />
        <DetailRow
          detail={"Initial Notional"}
          value={`${initialNotional} ${UNIT}`}
        />
        <DetailRow
          detail={"Maintenance"}
          value={`${maintenanceMargin} ${UNIT}`}
        />
      </Flex>
      <Flex direction={"column"} width={"100%"} mt={"30px"}>
        <DetailRow detail={"Entry Price"} value={entryPrice} />
        <DetailRow detail={"Current Price"} value={currentPrice} />
        <DetailRow
          detail={"Est. Received Price"}
          value={estimatedReceivedPrice}
        />
        <DetailRow detail={"Price Impact"} value={`${priceImpact}%`} />
        <DetailRow
          detail={"Liquidation Price (est)"}
          value={liquidationPrice}
        />
      </Flex>{" "}
    </ScrollContentWrapper>
  );
};

export default UnwindPositionDetails;
