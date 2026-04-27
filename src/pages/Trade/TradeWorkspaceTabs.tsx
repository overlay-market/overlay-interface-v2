import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Chart from "./Chart";
import GamblingTimeline from "./Chart/GamblingTimeline";
import PredictionGroupChart from "./PredictionGroupChart";
import Description from "./InfoMarketSection/Description";
import Analytics from "./InfoMarketSection/Analytics";
import GrafanaPanel from "./InfoMarketSection/GrafanaPanel";
import RiskParameters from "./InfoMarketSection/RiskParameters";
import { PredictionMarketGroup } from "../../constants/markets";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";
import theme from "../../theme";

type WorkspaceTab = "charts" | "overview" | "trading-data" | "risk-params";

type TradeWorkspaceTabsProps = {
  prices?: { bid: bigint; ask: bigint; mid: bigint };
  predictionGroup?: PredictionMarketGroup;
  shouldRenderGamblingTimeline: boolean;
};

const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "charts", label: "Charts" },
  { id: "overview", label: "Coin Overview" },
  { id: "trading-data", label: "Trading Data" },
  { id: "risk-params", label: "Risk Params" },
];

const WorkspaceShell = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: inherit;
  background: #08090a;
`;

const WorkspaceTabList = styled.div`
  display: flex;
  align-items: center;
  min-height: 44px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #070809;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const WorkspaceTabButton = styled.button<{ $active?: boolean }>`
  height: 44px;
  padding: 0 18px;
  border: 0;
  border-right: 1px solid ${theme.semantic.borderMuted};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? theme.semantic.textPrimary : "transparent")};
  background: ${({ $active }) => ($active ? "#101214" : "transparent")};
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${theme.semantic.textPrimary};
    background: ${theme.semantic.hover};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

const WorkspaceContent = styled.div<{ $scroll?: boolean }>`
  flex: 1;
  min-height: 0;
  overflow: ${({ $scroll }) => ($scroll ? "auto" : "hidden")};
  background: #08090a;
`;

const ChartFrame = styled.div`
  width: 100%;
  height: 100%;
  min-height: 420px;

  @media (min-width: ${theme.breakpoints.md}) {
    min-height: 520px;
  }
`;

const CoinOverviewPanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  padding: 14px;

  @media (min-width: 1180px) {
    grid-template-columns: minmax(360px, 0.72fr) minmax(260px, 0.28fr);
    align-items: start;
  }
`;

const TradingDataPanel = styled.div`
  padding: 14px;
`;

const RiskParamsPanel = styled.div`
  padding: 0 14px 14px;
`;

const TradeWorkspaceTabs: React.FC<TradeWorkspaceTabsProps> = ({
  prices,
  predictionGroup,
  shouldRenderGamblingTimeline,
}) => {
  const { currentMarket } = useCurrentMarketState();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("charts");

  useEffect(() => {
    setActiveTab("charts");
  }, [currentMarket?.id, predictionGroup?.groupId]);

  const chartContent = useMemo(() => {
    if (predictionGroup) {
      return <PredictionGroupChart group={predictionGroup} />;
    }

    if (shouldRenderGamblingTimeline) {
      return <GamblingTimeline />;
    }

    return <Chart prices={prices} />;
  }, [predictionGroup, shouldRenderGamblingTimeline, prices]);

  return (
    <WorkspaceShell>
      <WorkspaceTabList role="tablist" aria-label="Market workspace">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <WorkspaceTabButton
              key={tab.id}
              id={`trade-workspace-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`trade-workspace-panel-${tab.id}`}
              $active={isActive}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </WorkspaceTabButton>
          );
        })}
      </WorkspaceTabList>

      <WorkspaceContent
        id={`trade-workspace-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`trade-workspace-tab-${activeTab}`}
        $scroll={activeTab !== "charts"}
      >
        {activeTab === "charts" ? <ChartFrame>{chartContent}</ChartFrame> : null}

        {activeTab === "overview" ? (
          <CoinOverviewPanel>
            <Description />
            <Analytics />
          </CoinOverviewPanel>
        ) : null}

        {activeTab === "trading-data" ? (
          <TradingDataPanel>
            <GrafanaPanel />
          </TradingDataPanel>
        ) : null}

        {activeTab === "risk-params" ? (
          <RiskParamsPanel>
            <RiskParameters />
          </RiskParamsPanel>
        ) : null}
      </WorkspaceContent>
    </WorkspaceShell>
  );
};

export default TradeWorkspaceTabs;
