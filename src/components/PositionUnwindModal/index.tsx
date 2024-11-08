import { Flex, Text } from "@radix-ui/themes";
import Modal from "../Modal";
import theme from "../../theme";
import { useEffect, useState } from "react";
import useSDK from "../../hooks/useSDK";
import useAccount from "../../hooks/useAccount";
import {
  OpenPositionData,
  toWei,
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
            toWei(inputValue),
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
  }, [position, account, inputValue, open, slippageValue]);

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
          handleDismiss={handleDismiss}
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
