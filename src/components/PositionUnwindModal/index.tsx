import { Flex, Text } from "@radix-ui/themes";
import Modal from "../Modal";
import theme from "../../theme";
import { useEffect, useState } from "react";
import useAccount from "../../hooks/useAccount";
import {
  OpenPositionData,
  UnwindStateData,
  UnwindStateSuccess,
  UnwindStateError,
} from "overlay-sdk";
import useTypeGuard from "../../hooks/useTypeGuard";
import Loader from "../Loader";
import UnwindPosition from "./UnwindPosition";
import PositionNotFound from "./PositionNotFound";
import WithdrawOVL from "./WithdrawOVL";
import { useTradeState } from "../../state/trade/hooks";
import useSDK from "../../providers/SDKProvider/useSDK";

type PositionUnwindModalProps = {
  open: boolean;
  position: OpenPositionData;
  handleDismiss: () => void;
};

const PositionUnwindModal: React.FC<PositionUnwindModalProps> = ({
  open,
  position,
  handleDismiss,
}) => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isUnwindStateSuccess = useTypeGuard<UnwindStateSuccess>("pnl");
  const isUnwindStateError = useTypeGuard<UnwindStateError>("error");
  const { slippageValue } = useTradeState();

  const [unwindState, setUnwindState] = useState<UnwindStateData | undefined>(
    undefined
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [unwindPercentage, setUnwindPercentage] = useState<number>(0);
  const [stableQuote, setStableQuote] = useState<{ minOut: bigint; expectedOut: bigint } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteFailed, setQuoteFailed] = useState(false);

  useEffect(() => {
    setInputValue("");
  }, [open]);

  useEffect(() => {
    let isCancelled = false; // Flag to track if the effect should be cancelled

    const fetchUnwindState = async () => {
      if (!position || !account || !open) return;

      if (position && account && open) {
        try {
          const unwindState = await sdk.trade.getUnwindState(
            position.marketAddress,
            account,
            position.positionId,
            unwindPercentage,
            Number(slippageValue),
            4
          );

          if (!isCancelled && unwindState) {
            setUnwindState(unwindState);
          }
        } catch (error) {
          console.error("Error fetching unwind state:", error);
        }
      }
    };

    open && fetchUnwindState();

    // Cleanup function to cancel the fetch if conditions change
    return () => {
      isCancelled = true;
    };
  }, [position, account, open, slippageValue, unwindPercentage]);

  // Fetch USDT quote once when modal opens for LBSC positions with positive PnL
  useEffect(() => {
    // Only fetch when modal opens
    if (!open) {
      setStableQuote(null);
      return;
    }

    // Only fetch for LBSC positions (with loan) and positive unrealized PnL
    if (!position?.loan || !unwindState || !account) {
      setStableQuote(null);
      return;
    }

    // Check if PnL is positive
    if (isUnwindStateSuccess(unwindState) && Number(unwindState.pnl) <= 0) {
      setStableQuote(null);
      return;
    }

    let isCancelled = false;

    const fetchStableQuote = async () => {
      setQuoteLoading(true);
      setQuoteFailed(false);

      try {
        // For LBSC positions, calculate quote using oracle price instead of simulation
        // This matches the approach used for detail values
        const oraclePrice = await sdk.lbsc.getOraclePrice();

        // Get the position value in wei from unwindState
        const positionValueStr = isUnwindStateSuccess(unwindState) ? unwindState.value : '0';
        const positionValueWei = BigInt(Math.floor(Number(positionValueStr) * 1e18));

        // Calculate expected USDT output: (OVL value * oracle price) / WAD
        const WAD = BigInt(1e18);
        const expectedOut = (positionValueWei * oraclePrice) / WAD;

        // Calculate minimum output with slippage: expectedOut * (100 - slippage) / 100
        const slippagePercent = Number(slippageValue);
        const minOut = (expectedOut * BigInt(100 - slippagePercent)) / BigInt(100);

        const quote = { minOut, expectedOut };

        if (!isCancelled) {
          setStableQuote(quote);
        }
      } catch (error) {
        console.error('Failed to calculate stable quote:', error);
        if (!isCancelled) {
          setQuoteFailed(true);
        }
      } finally {
        if (!isCancelled) {
          setQuoteLoading(false);
        }
      }
    };

    fetchStableQuote();

    return () => {
      isCancelled = true;
    };
  }, [open, position?.loan, unwindState, account, slippageValue, sdk, isUnwindStateSuccess]);

  return (
    <Modal triggerElement={null} open={open} handleClose={handleDismiss}>
      <Flex mt={"24px"} direction={"column"} width={"100%"} align={"center"}>
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          ID: {position.positionId}
        </Text>
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "500",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          {position?.marketName}
        </Text>
      </Flex>

      {!unwindState && (
        <Flex width={"100%"} justify={"center"} p={"50px"}>
          <Loader />
        </Flex>
      )}

      {isUnwindStateSuccess(unwindState) && (
        <UnwindPosition
          position={position}
          unwindState={unwindState}
          inputValue={inputValue}
          setInputValue={setInputValue}
          unwindPercentage={unwindPercentage}
          setUnwindPercentage={setUnwindPercentage}
          handleDismiss={handleDismiss}
          stableQuote={stableQuote}
          quoteLoading={quoteLoading}
          quoteFailed={quoteFailed}
        />
      )}

      {isUnwindStateError(unwindState) && unwindState.isShutdown && (
        <WithdrawOVL
          position={position}
          unwindState={unwindState}
          handleDismiss={handleDismiss}
        />
      )}

      {isUnwindStateError(unwindState) && !unwindState.isShutdown && (
        <PositionNotFound />
      )}
    </Modal>
  );
};

export default PositionUnwindModal;
