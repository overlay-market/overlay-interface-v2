import { Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import styled from "styled-components";
import theme from "../../../theme";
import { focusRing } from "../../../styles/shared-styles";
import UnwindsTable from "../UnwindsTable";
import LiquidatesTable from "../LiquidatesTable";

const HISTORY_TABS = [
  { id: "closed", label: "Closed Positions" },
  { id: "liquidations", label: "Liquidations" },
] as const;

type HistoryTab = (typeof HISTORY_TABS)[number]["id"];

const PositionHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HistoryTab>("closed");

  return (
    <HistoryShell direction="column" width="100%">
      <HistoryHeader align="center" justify="between" gap="3">
        <Text weight="bold" size="5">
          Position History
        </Text>

        <HistoryTabs role="tablist" aria-label="Position history">
          {HISTORY_TABS.map((tab) => (
            <HistoryTabButton
              key={tab.id}
              id={`position-history-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`position-history-panel-${tab.id}`}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </HistoryTabButton>
          ))}
        </HistoryTabs>
      </HistoryHeader>

      <HistoryPanel
        id={`position-history-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`position-history-tab-${activeTab}`}
      >
        {activeTab === "closed" ? (
          <UnwindsTable embedded title="" />
        ) : (
          <LiquidatesTable embedded title="" />
        )}
      </HistoryPanel>
    </HistoryShell>
  );
};

const HistoryShell = styled(Flex)`
  padding: 28px 0 96px;
  border-bottom: 1px solid ${theme.semantic.border};
`;

const HistoryHeader = styled(Flex)`
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const HistoryTabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
`;

const HistoryTabButton = styled.button<{ $active?: boolean }>`
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid
    ${({ $active }) => ($active ? theme.semantic.accent : "transparent")};
  border-radius: ${theme.radius.sm};
  background: ${({ $active }) =>
    $active ? theme.semantic.hover : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
  ${focusRing}

  &:hover {
    background: ${theme.semantic.hover};
    color: ${theme.semantic.textPrimary};
  }
`;

const HistoryPanel = styled.div`
  width: 100%;
`;

export default PositionHistory;
