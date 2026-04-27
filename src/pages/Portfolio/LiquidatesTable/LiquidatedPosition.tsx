import { StyledCell, StyledRow } from "../../../components/Table";
import { LiquidatedPositionData } from "overlay-sdk";
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

  // Format size amount - use stable values if available (for LBSC positions)
  const collateralAmount = position.stableValues?.size
    ? `${position.stableValues.size} USDT`
    : `${position.size} OVL`;

  return (
    <StyledRow style={{ fontSize: "12px", cursor: "auto" }}>
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
          <CellValue>{position.created}</CellValue>
          <MutedCellValue>Opened</MutedCellValue>
        </CellStack>
      </StyledCell>
      <StyledCell>
        <CellStack>
          <CellValue $accent="negative">{position.liquidated}</CellValue>
          <MutedCellValue>Liquidated</MutedCellValue>
        </CellStack>
      </StyledCell>
    </StyledRow>
  );
};

export default LiquidatedPosition;
