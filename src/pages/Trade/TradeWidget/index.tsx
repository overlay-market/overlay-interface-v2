import MainTradeDetails from "./MainTradeDetails";
import {
  useIsNewTxnHash,
  useTradeActionHandlers,
  useTradeState,
  useCollateralType,
} from "../../../state/trade/hooks";
import AdditionalTradeDetails from "./AdditionalTradeDetails";
import TradeButtonComponent from "./TradeButtonComponent";
import PositionSelectComponent from "./PositionSelectComponent";
import CollateralInputComponent from "./CollateralInputComponent";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useEffect, useRef, useState } from "react";
import { Address, parseUnits } from "viem";
import { formatWeiToParsedNumber, toWei, TradeStateData } from "overlay-sdk";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useAccount from "../../../hooks/useAccount";
import Slider from "../../../components/Slider";
import {
  AdvancedPanel,
  AdvancedSettingsButton,
  OrderTypeButton,
  OrderTypeTabs,
  TicketMetaRow,
  TicketModeButton,
  TicketModeTabs,
  TradeWidgetContainer,
} from "./trade-widget-styles";
import useDebounce from "../../../hooks/useDebounce";
import theme from "../../../theme";
import ChainAndTokenSelect from "./ChainAndTokenSelect";
import { Flex, Checkbox, Text } from "@radix-ui/themes";
import { isGamblingMarket } from "../../../utils/marketGuards";
import { useStableTokenInfo } from "../../../hooks/useStableTokenInfo";
import { PredictionMarketGroup } from "../../../constants/markets";
import PredictionGroupPanel from "../PredictionGroupPanel";

interface TradeWidgetProps {
  prices?: { bid: bigint; ask: bigint; mid: bigint };
  predictionGroup?: PredictionMarketGroup;
  selectedMarketId?: string | null;
  isLong?: boolean;
  onOutcomeSelect?: (marketId: string, isLong: boolean) => void;
}

const TICKET_BALANCE_PLACEHOLDER = "LOREM IPSUM"; // TODO: Replace with selected collateral balance from the shared wallet balance hook.
const TICKET_MAX_OPEN_PLACEHOLDER = "Max Open: LOREM IPSUM"; // TODO: Replace with max-open values calculated from current collateral/leverage.

const TradeWidget: React.FC<TradeWidgetProps> = ({ prices, predictionGroup, selectedMarketId, isLong: isLongFromParent, onOutcomeSelect }) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const { address, isAvatarTradingActive } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const isNewTxnHash = useIsNewTxnHash();
  const { typedValue, selectedLeverage, isLong, slippageValue } =
    useTradeState();
  const collateralType = useCollateralType();
  const { handleLeverageSelect, handleCollateralTypeChange } = useTradeActionHandlers();
  const [loading, setLoading] = useState<boolean>(false);
  const [capLeverage, setCapleverage] = useState<number>(5);
  const [isLbscAvailable, setIsLbscAvailable] = useState<boolean>(true);
  const [tradeState, setTradeState] = useState<TradeStateData | undefined>(
    undefined
  );
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [ovlPreview, setOvlPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const debouncedTypedValue = useDebounce(typedValue, 500);
  const [leverageInputValue, setLeverageInputValue] = useState<string | null>(
    null
  );
  const debouncedSelectedLeverage = useDebounce(leverageInputValue, 500);
  const [displayedLeverage, setDisplayedLeverage] = useState(selectedLeverage);

  const sdkRef = useRef(sdk);
  const isGambling = isGamblingMarket(market?.marketName);
  const {
    data: stableTokenInfo,
    refetch: refetchStableTokenInfo,
    isRefetching,
  } = useStableTokenInfo({
    includeOraclePrice: true,
  });

  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  useEffect(() => {
    if (
      collateralType !== "USDT" ||
      !debouncedTypedValue ||
      Number(debouncedTypedValue) === 0 ||
      !stableTokenInfo
    ) {
      setOvlPreview(null);
      setPreviewLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchPreview = async () => {
      setPreviewLoading(true);
      try {
        const stableAmount = parseUnits(
          debouncedTypedValue,
          stableTokenInfo.decimals
        );
        const ovlAmount = await sdkRef.current?.lbsc.previewBorrow(
          stableAmount
        );
        if (isCancelled) return;
        const formattedOvl = ovlAmount
          ? formatWeiToParsedNumber(ovlAmount, 18, 4)
          : null;
        setOvlPreview(formattedOvl?.toString() ?? null);
      } catch {
        if (!isCancelled) {
          setOvlPreview(null);
        }
      } finally {
        if (!isCancelled) {
          setPreviewLoading(false);
        }
      }
    };

    fetchPreview();

    return () => {
      isCancelled = true;
    };
  }, [collateralType, debouncedTypedValue, stableTokenInfo]);

  // Reset to USDT collateral when funded trading is active (LiFi not available)
  useEffect(() => {
    if (isAvatarTradingActive && collateralType === 'OVL') {
      handleCollateralTypeChange('USDT');
    }
  }, [isAvatarTradingActive, collateralType, handleCollateralTypeChange]);

  // Check if LBSC is available on current chain
  useEffect(() => {
    if (!sdkRef.current) return;
    sdkRef.current.lbsc.isAvailable()
      .then(setIsLbscAvailable)
      .catch(() => setIsLbscAvailable(false));
  }, [chainId]);

  useEffect(() => {
    setDisplayedLeverage(selectedLeverage);
  }, [selectedLeverage]);

  useEffect(() => {
    if (marketId && !isGambling && !predictionGroup) {
      handleLeverageSelect("5");
    }
  }, [marketId, isGambling, predictionGroup, handleLeverageSelect]);

  useEffect(() => {
    if (!isGambling) {
      return;
    }

    if (selectedLeverage !== "1") {
      handleLeverageSelect("1");
    }
    setDisplayedLeverage("1");
    setLeverageInputValue("1");
  }, [isGambling, selectedLeverage, handleLeverageSelect]);

  useEffect(() => {
    if (debouncedSelectedLeverage !== null && !isGambling) {
      handleLeverageSelect(debouncedSelectedLeverage);
    }
  }, [debouncedSelectedLeverage, isGambling, handleLeverageSelect]);

  useEffect(() => {
    let isCancelled = false;
    setLoading(false);

    const fetchTradeState = async () => {
      if (
        !debouncedTypedValue ||
        debouncedTypedValue === "" ||
        Number(debouncedTypedValue) === 0
      ) {
        setTradeState(undefined);
        return;
      }

      if (marketId && address && debouncedTypedValue !== "") {
        setLoading(true);

        try {
          // Get collateral amount in correct decimals
          let collateralAmount: bigint;
          if (collateralType === 'USDT') {
            // For USDT: use token decimals from hook
            if (!stableTokenInfo) {
              // Skip if stable token info not loaded yet
              return;
            }
            collateralAmount = parseUnits(debouncedTypedValue, stableTokenInfo.decimals);
          } else {
            // For OVL: use 18 decimals
            collateralAmount = toWei(debouncedTypedValue);
          }

          const tradeState = await sdkRef.current.trade.getTradeState(
            marketId,
            collateralAmount,
            toWei(selectedLeverage),
            Number(slippageValue),
            isLong,
            address,
            collateralType
          );
          if (!isCancelled && tradeState) {
            setTradeState(tradeState);
          }
        } catch (error) {
          // Error fetching trade state
        } finally {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      }
    };

    fetchTradeState();

    return () => {
      isCancelled = true;
    };
  }, [
    marketId,
    address,
    debouncedTypedValue,
    selectedLeverage,
    chainId,
    isLong,
    slippageValue,
    isNewTxnHash,
    collateralType,
    stableTokenInfo,
  ]);

  useEffect(() => {
    if (!market?.id) return;

    const fetchCapLeverage = async () => {
      try {
        const capLeverage = await sdkRef.current.market.getCapLeverage(
          market.id as Address
        );
        const parsedCapLeverage = formatWeiToParsedNumber(capLeverage, 18, 2);
        if (parsedCapLeverage) {
          setCapleverage(parsedCapLeverage);

          // Always adjust leverage when market changes
          // Get current leverage from Redux state
          const currentLeverage = Number(selectedLeverage);

          if (parsedCapLeverage <= 1) {
            // Market has fixed leverage at 1x - always set to 1
            handleLeverageSelect("1");
            setDisplayedLeverage("1");
          } else if (currentLeverage > parsedCapLeverage) {
            // Selected leverage exceeds new market's max leverage - clamp it
            const newLeverage = Math.min(currentLeverage, parsedCapLeverage).toString();
            handleLeverageSelect(newLeverage);
            setDisplayedLeverage(newLeverage);
          } else if (currentLeverage < 1) {
            // Edge case: leverage is somehow less than 1, reset to minimum
            handleLeverageSelect("1");
            setDisplayedLeverage("1");
          }
        }
      } catch (error) {
        // Error fetching capLeverage
      }
    };

    fetchCapLeverage();
    // Run when market changes or wallet connects/disconnects
  }, [market?.id, address]);

  const handleLeverageInput = (newValue: number[]) => {
    const stringValue = newValue[0].toString();
    setLeverageInputValue(stringValue);
    setDisplayedLeverage(stringValue);
  };

  return (
    <TradeWidgetContainer
      direction={"column"}
      gap={{ initial: "12px", sm: "14px" }}
      width={{ initial: "100%", sm: "321px" }}
      pr={"0px"}
      pl={"0px"}
      pt={"0px"}
      pb={"0px"}
      flexShrink={"0"}
    >
      <TicketModeTabs aria-label="Position mode">
        <TicketModeButton type="button" $active>
          Open
        </TicketModeButton>
        {/* TODO: Wire LOREM IPSUM close-position ticket when close-order composition exists. */}
        <TicketModeButton type="button" disabled>
          Close
        </TicketModeButton>
      </TicketModeTabs>

      <OrderTypeTabs aria-label="Order type">
        {/* TODO: Replace disabled LOREM IPSUM order-type affordances when limit/conditional orders are supported. */}
        <OrderTypeButton type="button" disabled>
          Limit
        </OrderTypeButton>
        <OrderTypeButton type="button" $active>
          Market
        </OrderTypeButton>
        <OrderTypeButton type="button" disabled>
          Conditional
        </OrderTypeButton>
      </OrderTypeTabs>

      {predictionGroup && onOutcomeSelect ? (
        <PredictionGroupPanel
          group={predictionGroup}
          selectedMarketId={selectedMarketId ?? null}
          isLong={isLongFromParent ?? true}
          onOutcomeSelect={onOutcomeSelect}
        />
      ) : (
        <PositionSelectComponent prices={prices} />
      )}

      {!isGambling ? (
        <Slider
          title={"Leverage"}
          min={1}
          max={capLeverage ?? 1}
          step={capLeverage <= 1 ? 1 : 0.1}
          value={Number(displayedLeverage)}
          valueUnit={"x"}
          handleChange={(newValue: number[]) => handleLeverageInput(newValue)}
        />
      ) : null}

      {collateralType === 'OVL' && !isAvatarTradingActive && <ChainAndTokenSelect />}
      <CollateralInputComponent />
      <TicketMetaRow>
        <span>Available</span>
        <span>{TICKET_BALANCE_PLACEHOLDER}</span>
      </TicketMetaRow>
      <TradeButtonComponent loading={loading} tradeState={tradeState} />
      <TicketMetaRow>
        <span>{TICKET_MAX_OPEN_PLACEHOLDER}</span>
        <span>{TICKET_MAX_OPEN_PLACEHOLDER}</span>
      </TicketMetaRow>
      <AdvancedSettingsButton
        onClick={() => setDetailsOpen((o) => !o)}
        type="button"
        aria-expanded={detailsOpen}
      >
        {detailsOpen ? "Hide Advanced Settings" : "Advanced Settings"}
      </AdvancedSettingsButton>

      {/* Conditionally render details */}
      {detailsOpen && (
        <AdvancedPanel
          direction={"column"}
          gap="14px"
        >
          <Flex direction="column" gap="12px" p="8px">
            {isLbscAvailable && !isAvatarTradingActive && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <Checkbox
                  checked={collateralType === 'OVL'}
                  onCheckedChange={(checked) => handleCollateralTypeChange(checked ? 'OVL' : 'USDT')}
                />
                <Text size="2" style={{ color: theme.color.grey1 }}>
                  Use OVL as collateral (cross-chain)
                </Text>
              </label>
            )}
            {collateralType === "USDT" && (
              <Flex direction="column" gap="8px">
                <Flex justify="between">
                  <Text size="1" style={{ color: theme.color.grey3 }}>
                    OVL Collateral
                  </Text>
                  <Text size="1" style={{ color: theme.color.blue1 }}>
                    {previewLoading
                      ? "Calculating..."
                      : ovlPreview
                        ? `~${ovlPreview} OVL`
                        : "-"}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Flex align="center" gap="1">
                    <Text size="1" style={{ color: theme.color.grey3 }}>
                      Borrow Price
                    </Text>
                    <Text
                      size="1"
                      onClick={() => refetchStableTokenInfo()}
                      style={{
                        color: theme.color.blue1,
                        cursor: "pointer",
                        userSelect: "none",
                        opacity: isRefetching ? 0.5 : 1,
                        transition: "opacity 0.2s",
                      }}
                      title="Refresh oracle price"
                    >
                      {isRefetching ? "⟳" : "↻"}
                    </Text>
                  </Flex>
                  <Text size="1" style={{ color: theme.color.grey2 }}>
                    {stableTokenInfo?.oraclePrice
                      ? `1 OVL = $${formatWeiToParsedNumber(
                        stableTokenInfo.oraclePrice,
                        18,
                        4
                      )?.toFixed(4) ?? "0.0000"
                      }`
                      : "-"}
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>

          <MainTradeDetails tradeState={tradeState} />
          <AdditionalTradeDetails tradeState={tradeState} />
        </AdvancedPanel>
      )}
    </TradeWidgetContainer>
  );
};

export default TradeWidget;
