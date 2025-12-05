import { Flex } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import theme from "../../../theme";
import DetailRow from "../../Modal/DetailRow";
import { UNIT } from "../../../constants/applications";
import { ScrollContentWrapper } from "./unwind-position-details-styles";
import { OpenPositionData, UnwindStateSuccess } from "overlay-sdk";
import { formatUnits } from "viem";
import { useStableTokenInfo } from "../../../hooks/useStableTokenInfo";

type UnwindPositionDetailsProps = {
  position: OpenPositionData;
  unwindState: UnwindStateSuccess;
  stableQuote?: { minOut: bigint; expectedOut: bigint } | null;
  quoteLoading?: boolean;
  quoteFailed?: boolean;
};

const UnwindPositionDetails: React.FC<UnwindPositionDetailsProps> = ({
  position,
  unwindState,
  stableQuote,
  quoteLoading,
  quoteFailed,
}) => {
  const { data: stableTokenInfo } = useStableTokenInfo();
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const {
    pnl,
    pnlDisplay,
    pnlUnit,
    minReceivedDisplay,
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
    const pnlNumber = pnl ? Number(pnl) : 0;

    // Calculate PnL display values
    let pnlDisplay: string;
    let pnlUnit: string;
    let minReceivedDisplay: string | null = null;

    if (pnlNumber < 0) {
      // Negative PnL: Use proportional USDT from stableValues
      if (position.stableValues?.unrealizedPnL) {
        pnlDisplay = position.stableValues.unrealizedPnL;
        pnlUnit = 'USDT';
      } else {
        pnlDisplay = pnl || '0';
        pnlUnit = UNIT;
      }
    } else if (pnlNumber > 0 && position.loan) {
      // Positive PnL with loan: Try to use quote from simulation
      if (quoteLoading) {
        pnlDisplay = 'Calculating...';
        pnlUnit = '';
        minReceivedDisplay = '-';
      } else if (stableQuote && stableTokenInfo) {
        // Quote successful - show expected and minimum
        const expectedAmount = formatUnits(stableQuote.expectedOut, stableTokenInfo.decimals);
        const minAmount = formatUnits(stableQuote.minOut, stableTokenInfo.decimals);

        pnlDisplay = Number(expectedAmount) < 1
          ? Number(expectedAmount).toFixed(6)
          : Number(expectedAmount).toFixed(2);
        pnlUnit = 'USDT';

        minReceivedDisplay = Number(minAmount) < 1
          ? `${Number(minAmount).toFixed(6)} USDT`
          : `${Number(minAmount).toFixed(2)} USDT`;
      } else if (quoteFailed && position.stableValues?.unrealizedPnL) {
        // Quote failed: Fall back to oracle price estimate
        pnlDisplay = position.stableValues.unrealizedPnL;
        pnlUnit = 'USDT (estimate)';
      } else {
        // No quote available: show OVL
        pnlDisplay = pnl || '0';
        pnlUnit = UNIT;
      }
    } else {
      // Zero or no loan: show OVL
      pnlDisplay = pnl || '0';
      pnlUnit = UNIT;
    }
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
      pnlDisplay,
      pnlUnit,
      minReceivedDisplay,
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
  }, [unwindState, position, stableQuote, quoteLoading, quoteFailed, stableTokenInfo]);

  return (
    <ScrollContentWrapper>
      <Flex direction={"column"} width={"100%"}>
        <DetailRow
          detail={"Profit/Loss"}
          value={`${pnlDisplay} ${pnlUnit}`}
          valueColor={
            Number(pnl) === 0
              ? ""
              : Number(pnl) > 0
              ? theme.color.green1
              : theme.color.red1
          }
        />
        {minReceivedDisplay && (
          <DetailRow
            detail={"Minimum Received"}
            value={minReceivedDisplay}
          />
        )}
      </Flex>

      <button
        onClick={() => setDetailsOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          padding: "8px 0",
          marginTop: "12px",
          fontSize: "14px",
          fontWeight: 500,
          color: theme.color.grey3,
          cursor: "pointer",
          textAlign: "center",
          outline: "none",
          width: "100%",
        }}
      >
        {detailsOpen ? "Hide Details ▲" : "Show Details ▼"}
      </button>

      {detailsOpen && (
        <>
          <Flex direction={"column"} width={"100%"} mt={"16px"}>
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
          </Flex>
        </>
      )}
    </ScrollContentWrapper>
  );
};

export default UnwindPositionDetails;
