import { StyledCell, StyledRow } from "../../../components/Table";
import { UnwindPositionData } from "overlay-sdk";
import {
  CellStack,
  CellValue,
  ContractMeta,
  ContractName,
  ContractStack,
  MetaBadge,
  MutedCellValue,
  SideBadge,
} from "../../../styles/positions-table";

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
  const pnlToken = position.stableValues ? "USDT" : "OVL";

  return (
    <StyledRow style={{ fontSize: "12px", cursor: "default" }}>
      <StyledCell>
        <ContractStack $long={isLong}>
          <ContractName>{position.marketName}</ContractName>
          <ContractMeta>
            <SideBadge $long={isLong}>{positionSide}</SideBadge>
            <MetaBadge>Cross</MetaBadge>
            <MetaBadge>{positionLeverage && Number(positionLeverage.slice(0, -1))}x</MetaBadge>
          </ContractMeta>
        </ContractStack>
      </StyledCell>
      <StyledCell>
        <CellValue>{collateralAmount}</CellValue>
      </StyledCell>
      <StyledCell>
        <CellValue>{position.entryPrice}</CellValue>
      </StyledCell>
      <StyledCell>
        <CellValue>{position.exitPrice}</CellValue>
      </StyledCell>
      <StyledCell>
        <CellStack>
          <CellValue>{position.parsedCreatedTimestamp}</CellValue>
          <MutedCellValue>Opened</MutedCellValue>
        </CellStack>
      </StyledCell>
      <StyledCell>
        <CellStack>
          <CellValue>{position.parsedClosedTimestamp}</CellValue>
          <MutedCellValue>Closed</MutedCellValue>
        </CellStack>
      </StyledCell>
      <StyledCell>
        <CellStack>
          <CellValue $accent={isPnLPositive ? "positive" : "negative"}>
            {pnl}
          </CellValue>
          <MutedCellValue>{position.pnl} {pnlToken}</MutedCellValue>
        </CellStack>
      </StyledCell>
    </StyledRow>
  );
};

export default UnwindPosition;
