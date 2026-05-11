import { useState } from "react";
import styled from "styled-components";
import theme from "../../../theme";
import { focusRing } from "../../../styles/shared-styles";
import UnwindsTable from "../../Portfolio/UnwindsTable";
import LiquidatesTable from "../../Portfolio/LiquidatesTable";

const HISTORY_TABS = [
  { id: "closed", label: "Closed Positions" },
  { id: "liquidations", label: "Liquidations" },
] as const;

type HistoryTab = (typeof HISTORY_TABS)[number]["id"];

const PositionHistoryPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HistoryTab>("closed");

  return (
    <HistoryPanel>
      <HistoryTabs role="tablist" aria-label="Position history detail">
        {HISTORY_TABS.map((tab) => (
          <HistoryTabButton
            key={tab.id}
            id={`trade-position-history-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`trade-position-history-panel-${tab.id}`}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </HistoryTabButton>
        ))}
      </HistoryTabs>

      <HistoryTablePanel
        id={`trade-position-history-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`trade-position-history-tab-${activeTab}`}
      >
        {activeTab === "closed" ? (
          <UnwindsTable embedded title="" />
        ) : (
          <LiquidatesTable embedded title="" />
        )}
      </HistoryTablePanel>
    </HistoryPanel>
  );
};

const HistoryPanel = styled.div`
  padding: 12px 0 16px;
`;

const HistoryTabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 16px;
  padding: 3px;
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
`;

const HistoryTabButton = styled.button<{ $active?: boolean }>`
  min-height: 30px;
  padding: 0 11px;
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
  ${focusRing}

  &:hover {
    background: ${theme.semantic.hover};
    color: ${theme.semantic.textPrimary};
  }
`;

const HistoryTablePanel = styled.div`
  width: 100%;
`;

export default PositionHistoryPanel;
