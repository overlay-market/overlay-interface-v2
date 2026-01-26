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
import { TradeWidgetContainer } from "./trade-widget-styles";
import useDebounce from "../../../hooks/useDebounce";
import theme from "../../../theme";
import ChainAndTokenSelect from "./ChainAndTokenSelect";
import { Flex, Checkbox, Text } from "@radix-ui/themes";
import { isGamblingMarket } from "../../../utils/marketGuards";
import { useStableTokenInfo } from "../../../hooks/useStableTokenInfo";

interface TradeWidgetProps {
  prices?: { bid: bigint; ask: bigint; mid: bigint };
}

const TradeWidget: React.FC<TradeWidgetProps> = ({ prices }) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
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
    if (marketId && !isGambling) {
      handleLeverageSelect("5");
    }
  }, [marketId, isGambling, handleLeverageSelect]);

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
      gap={{ initial: "16px", sm: "24px" }}
      width={{ initial: "343px", sm: "321px" }}
      pr={"0px"}
      pl={{ initial: "0px", sm: "16px", lg: "8px" }}
      pt={"8px"}
      pb={"20px"}
      flexShrink={"0"}
    >
      <PositionSelectComponent prices={prices} />

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

      {collateralType === 'OVL' && <ChainAndTokenSelect />}
      <CollateralInputComponent />
      <TradeButtonComponent loading={loading} tradeState={tradeState} />
      <button
        onClick={() => setDetailsOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          marginBottom: "8px",
          fontSize: "16px",
          fontWeight: 500,
          color: theme.color.grey3,
          cursor: "pointer",
          textAlign: "right",
          outline: "none",
        }}
      >
        {detailsOpen ? "Hide Advanced Settings ▲" : "Advanced Settings ▼"}
      </button>

      {/* Conditionally render details */}
      {detailsOpen && (
        <Flex
          style={{
            background: theme.color.background,
            zIndex: 100,
            border: "8px solid transparent",
            boxShadow: `rgb(0 0 0 / 40%) 0px 0px 12px 0px`,
            marginTop: "-14px",
          }}
          direction={"column"}
          gap="16px"
        >
          <Flex direction="column" gap="12px" p="8px">
            {isLbscAvailable && (
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
        </Flex>
      )}
    </TradeWidgetContainer>
  );
};

export default TradeWidget;
