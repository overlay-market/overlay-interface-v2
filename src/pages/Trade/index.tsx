import { Flex } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTradeActionHandlers, useTradeState } from "../../state/trade/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSDK from "../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import Loader from "../../components/Loader";
import {
  useCurrentMarketActionHandlers,
  useCurrentMarketState,
} from "../../state/currentMarket/hooks";
import PositionsTable from "./PositionsTable";
import {
  AssetsBody,
  AssetsHeader,
  AssetsRegion,
  BottomTab,
  BottomTabs,
  ChartRegion,
  ControlPill,
  OrderBookRegion,
  PositionsPlaceholder,
  PositionsRegion,
  PositionsTabPanel,
  TicketRegion,
  TradeContainer,
  TradeGrid,
  TradeMarketBar,
  TradeShell,
  TradeTopRightControls,
} from "./trade-styles";
import { DEFAULT_MARKET } from "../../constants/applications";
import useActiveMarkets from "../../hooks/useActiveMarkets";
import { isGamblingMarket, getMarketGroup, getGroupById } from "../../utils/marketGuards";
import { PredictionMarketGroup } from "../../constants/markets";
import TradeTickerStrip from "./TradeTickerStrip";
import OrderBookPanel from "./OrderBookPanel";
import TradeWorkspaceTabs from "./TradeWorkspaceTabs";
import PositionHistoryPanel from "./PositionHistoryPanel";

const POSITION_TABS = [
  { id: "positions", label: "Positions" },
  { id: "position-history", label: "Position History" },
  { id: "open-orders", label: "Open Orders" },
  { id: "order-history", label: "Order History" },
  { id: "trade-history", label: "Trade History" },
  { id: "transaction-history", label: "Transaction History" },
] as const;

type PositionTab = (typeof POSITION_TABS)[number]["id"];

const Trade: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const marketParam = searchParams.get("market");
  const groupParam = searchParams.get("group");

  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const { currentMarket } = useCurrentMarketState();
  const { handleTradeStateReset, handlePositionSideSelect } = useTradeActionHandlers();
  const { isLong, selectedLeverage } = useTradeState();
  const { handleCurrentMarketSet } = useCurrentMarketActionHandlers();
  const { data: markets } = useActiveMarkets();
  const prevMarketRef = useRef<string | undefined>();

  // Store prices from PositionsTable to pass to Chart and TradeWidget
  // This eliminates duplicate bid/ask polling
  const [marketPrices, setMarketPrices] = useState<{ bid: bigint; ask: bigint; mid: bigint } | undefined>(undefined);
  const [activePositionTab, setActivePositionTab] =
    useState<PositionTab>("positions");

  const handlePricesUpdate = useCallback((prices: { bid: bigint; ask: bigint; mid: bigint } | undefined) => {
    setMarketPrices(prices);
  }, []);

  // Determine if we're in prediction group mode
  const predictionGroup = useMemo((): PredictionMarketGroup | undefined => {
    if (groupParam) {
      return getGroupById(groupParam);
    }
    if (marketParam) {
      return getMarketGroup(decodeURIComponent(marketParam));
    }
    return undefined;
  }, [groupParam, marketParam]);

  const shouldRenderGamblingTimeline = useMemo(() => {
    if (!currentMarket) {
      return false;
    }

    return isGamblingMarket(currentMarket.marketName);
  }, [currentMarket]);

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  // Default to first market in group if group param set but no market param
  useEffect(() => {
    if (predictionGroup && !marketParam) {
      setSearchParams(
        { group: predictionGroup.groupId, market: predictionGroup.marketIds[0] },
        { replace: true }
      );
      return;
    }
    if (!marketParam && !groupParam) {
      setSearchParams({ market: DEFAULT_MARKET }, { replace: true });
    }
  }, [marketParam, groupParam, predictionGroup]);

  // Auto-add group param when navigating to a grouped market directly
  useEffect(() => {
    if (predictionGroup && marketParam && !groupParam) {
      setSearchParams(
        { group: predictionGroup.groupId, market: marketParam },
        { replace: true }
      );
    }
  }, [predictionGroup, marketParam, groupParam]);

  useEffect(() => {
    if (!markets || !marketParam) return;

    const normalized = decodeURIComponent(marketParam).toLowerCase();

    const selected = markets.find(
      (m) => m.marketName.toLowerCase() === normalized
    );

    if (selected) {
      handleCurrentMarketSet(selected);
      return;
    }

    const fallback = markets[0];
    handleCurrentMarketSet(fallback);
    navigate(`/trade?market=${encodeURIComponent(fallback.marketName)}`, {
      replace: true,
    });
  }, [marketParam, markets]);

  useEffect(() => {
    if (!currentMarket) return;

    const name = currentMarket.marketName;
    if (prevMarketRef.current !== name) {
      // Don't reset collateral when switching between outcomes in a prediction group
      if (!predictionGroup) {
        handleTradeStateReset();
      }
    }

    prevMarketRef.current = name;
  }, [currentMarket, chainId, predictionGroup]);

  const handleOutcomeSelect = useCallback(
    (marketId: string, newIsLong: boolean) => {
      const params: Record<string, string> = { market: marketId };
      if (predictionGroup) {
        params.group = predictionGroup.groupId;
      }
      setSearchParams(params, { replace: true });
      handlePositionSideSelect(newIsLong);
    },
    [predictionGroup, setSearchParams, handlePositionSideSelect]
  );

  return (
    <TradeContainer direction="column" width={"100%"}>
      <TradeShell>
        <TradeTickerStrip markets={markets} activeMarketId={marketParam} />
        <TradeMarketBar>
          <TradeHeader predictionGroup={predictionGroup} />
          <TradeTopRightControls>
            <ControlPill type="button">Cross</ControlPill>
            <ControlPill type="button">Leverage {selectedLeverage}x</ControlPill>
            <ControlPill type="button" aria-label="Trade settings">▦</ControlPill>
          </TradeTopRightControls>
        </TradeMarketBar>

        <TradeGrid>
          {currentMarket ? (
            <>
              <ChartRegion>
                <TradeWorkspaceTabs
                  prices={marketPrices}
                  predictionGroup={predictionGroup}
                  shouldRenderGamblingTimeline={shouldRenderGamblingTimeline}
                />
              </ChartRegion>
              <OrderBookRegion>
                <OrderBookPanel prices={marketPrices} />
              </OrderBookRegion>
              <TicketRegion>
                <TradeWidget
                  prices={marketPrices}
                  predictionGroup={predictionGroup}
                  selectedMarketId={marketParam}
                  isLong={isLong}
                  onOutcomeSelect={handleOutcomeSelect}
                />
              </TicketRegion>
            </>
          ) : (
            <Flex
              width={"100%"}
              height={"100%"}
              align={"center"}
              justify={"center"}
            >
              <Loader />
            </Flex>
          )}
          <PositionsRegion>
            <BottomTabs role="tablist" aria-label="Positions and orders">
              {POSITION_TABS.map((tab) => (
                <BottomTab
                  key={tab.id}
                  id={`trade-bottom-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activePositionTab === tab.id}
                  aria-controls={`trade-bottom-panel-${tab.id}`}
                  $active={activePositionTab === tab.id}
                  onClick={() => setActivePositionTab(tab.id)}
                >
                  {tab.label}
                </BottomTab>
              ))}
            </BottomTabs>
            <PositionsTabPanel
              id="trade-bottom-panel-positions"
              role="tabpanel"
              aria-labelledby="trade-bottom-tab-positions"
              hidden={activePositionTab !== "positions"}
            >
              <PositionsTable onPricesUpdate={handlePricesUpdate} />
            </PositionsTabPanel>
            {activePositionTab === "position-history" && (
              <PositionsTabPanel
                id="trade-bottom-panel-position-history"
                role="tabpanel"
                aria-labelledby="trade-bottom-tab-position-history"
              >
                <PositionHistoryPanel />
              </PositionsTabPanel>
            )}
            {activePositionTab !== "positions" &&
              activePositionTab !== "position-history" && (
                <PositionsTabPanel
                  id={`trade-bottom-panel-${activePositionTab}`}
                  role="tabpanel"
                  aria-labelledby={`trade-bottom-tab-${activePositionTab}`}
                >
                  {/* TODO: Wire real order/trade/transaction history tables. */}
                  <PositionsPlaceholder>LOREM IPSUM</PositionsPlaceholder>
                </PositionsTabPanel>
              )}
          </PositionsRegion>
          <AssetsRegion>
            <AssetsHeader>Assets</AssetsHeader>
            <AssetsBody>Connect Wallet</AssetsBody>
          </AssetsRegion>
        </TradeGrid>

      </TradeShell>
    </TradeContainer>
  );
};

export default Trade;
