import MainTradeDetails from "./MainTradeDetails";
import {
  useIsNewTxnHash,
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import AdditionalTradeDetails from "./AdditionalTradeDetails";
import TradeButtonComponent from "./TradeButtonComponent";
import PositionSelectComponent from "./PositionSelectComponent";
import CollateralInputComponent from "./CollateralInputComponent";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useEffect, useRef, useState } from "react";
import { Address } from "viem";
import { formatWeiToParsedNumber, toWei, TradeStateData } from "overlay-sdk";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useAccount from "../../../hooks/useAccount";
import Slider from "../../../components/Slider";
import { TradeWidgetContainer } from "./trade-widget-styles";
import useDebounce from "../../../hooks/useDebounce";
import theme from "../../../theme";
import ChainAndTokenSelect from "./ChainAndTokenSelect";
import { Flex } from "@radix-ui/themes";

const TradeWidget: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const isNewTxnHash = useIsNewTxnHash();
  const { typedValue, selectedLeverage, isLong, slippageValue } =
    useTradeState();
  const { handleLeverageSelect } = useTradeActionHandlers();
  const [loading, setLoading] = useState<boolean>(false);
  const [capLeverage, setCapleverage] = useState<number>(5);
  const [tradeState, setTradeState] = useState<TradeStateData | undefined>(
    undefined
  );
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const debouncedTypedValue = useDebounce(typedValue, 500);
  const [leverageInputValue, setLeverageInputValue] = useState<string | null>(
    null
  );
  const debouncedSelectedLeverage = useDebounce(leverageInputValue, 500);
  const [displayedLeverage, setDisplayedLeverage] = useState(selectedLeverage);

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  useEffect(() => {
    setDisplayedLeverage(selectedLeverage);
  }, [selectedLeverage]);

  useEffect(() => {
    if (debouncedSelectedLeverage !== null) {
      handleLeverageSelect(debouncedSelectedLeverage);
    }
  }, [debouncedSelectedLeverage]);

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
          const tradeState = await sdkRef.current.trade.getTradeState(
            marketId,
            toWei(debouncedTypedValue),
            toWei(selectedLeverage),
            Number(slippageValue),
            isLong,
            address
          );
          if (!isCancelled && tradeState) {
            setTradeState(tradeState);
            console.log("Trade state fetched:", tradeState);
          }
        } catch (error) {
          console.error("Error fetching trade state:", error);
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
  ]);

  useEffect(() => {
    if (!market?.id) return;

    const fetchCapLeverage = async () => {
      try {
        const capLeverage = await sdkRef.current.market.getCapLeverage(
          market.id as Address
        );
        const parsedCapLeverage = formatWeiToParsedNumber(capLeverage, 2);
        parsedCapLeverage &&
          setCapleverage((prev) =>
            prev === parsedCapLeverage ? prev : parsedCapLeverage
          );
      } catch (error) {
        console.error("Error fetching capLeverage:", error);
      }
    };

    fetchCapLeverage();
  }, [market?.id]);

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
      <PositionSelectComponent />

      <Slider
        title={"Leverage"}
        min={1}
        max={capLeverage ?? 1}
        step={0.1}
        value={Number(displayedLeverage)}
        valueUnit={"x"}
        handleChange={(newValue: number[]) => handleLeverageInput(newValue)}
      />

      <ChainAndTokenSelect />
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
        {detailsOpen ? "Hide Info ▲" : "More Info ▼"}
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
        >
          <MainTradeDetails tradeState={tradeState} />
          <AdditionalTradeDetails tradeState={tradeState} />
        </Flex>
      )}
    </TradeWidgetContainer>
  );
};

export default TradeWidget;
