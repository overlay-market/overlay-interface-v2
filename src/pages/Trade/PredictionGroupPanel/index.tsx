import { Flex, Text } from "@radix-ui/themes";
import { PredictionMarketGroup } from "../../../constants/markets";
import useActiveMarkets from "../../../hooks/useActiveMarkets";
import useBidAndAsk from "../../../hooks/useBidAndAsk";
import { getMarketLogo } from "../../../utils/getMarketLogo";
import theme from "../../../theme";
import {
  PanelContainer,
  OutcomeRow,
  OutcomeLogo,
  ProbabilityText,
  YesButton,
  NoButton,
} from "./prediction-group-panel-styles";

interface OutcomeRowItemProps {
  marketId: string;
  label: string;
  isSelected: boolean;
  selectedIsLong: boolean;
  onSelect: (marketId: string, isLong: boolean) => void;
}

const OutcomeRowItem: React.FC<OutcomeRowItemProps> = ({
  marketId,
  label,
  isSelected,
  selectedIsLong,
  onSelect,
}) => {
  const { bid, ask } = useBidAndAsk(marketId);

  // Mid price as probability percentage
  const midPrice =
    bid !== undefined && ask !== undefined
      ? ((bid + ask) / 2) * 100
      : undefined;

  return (
    <OutcomeRow
      $selected={isSelected}
      onClick={() => onSelect(marketId, true)}
    >
      <Flex align="center" gap="10px" style={{ flex: 1, minWidth: 0 }}>
        <OutcomeLogo
          src={getMarketLogo(marketId)}
          alt={label}
        />
        <Text size="2" weight="medium" style={{ color: theme.color.white }}>
          {label}
        </Text>
      </Flex>

      <Flex align="center" gap="8px">
        <ProbabilityText>
          {midPrice !== undefined ? `${midPrice.toFixed(1)}%` : "-"}
        </ProbabilityText>
        <Flex gap="4px">
          <YesButton
            $active={isSelected && selectedIsLong}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(marketId, true);
            }}
          >
            Yes
          </YesButton>
          <NoButton
            $active={isSelected && !selectedIsLong}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(marketId, false);
            }}
          >
            No
          </NoButton>
        </Flex>
      </Flex>
    </OutcomeRow>
  );
};

interface PredictionGroupPanelProps {
  group: PredictionMarketGroup;
  selectedMarketId: string | null;
  isLong: boolean;
  onOutcomeSelect: (marketId: string, isLong: boolean) => void;
}

const PredictionGroupPanel: React.FC<PredictionGroupPanelProps> = ({
  group,
  selectedMarketId,
  isLong,
  onOutcomeSelect,
}) => {
  const { data: markets } = useActiveMarkets();

  // Filter to only markets that exist on-chain
  const activeMarketIds = new Set(markets?.map((m) => m.marketId) ?? []);
  const visibleMarketIds = group.marketIds.filter((id) =>
    activeMarketIds.has(id)
  );

  return (
    <PanelContainer>
      {visibleMarketIds.map((marketId) => (
        <OutcomeRowItem
          key={marketId}
          marketId={marketId}
          label={group.outcomeLabels[marketId] ?? decodeURIComponent(marketId)}
          isSelected={selectedMarketId === marketId}
          selectedIsLong={isLong}
          onSelect={onOutcomeSelect}
        />
      ))}
    </PanelContainer>
  );
};

export default PredictionGroupPanel;
