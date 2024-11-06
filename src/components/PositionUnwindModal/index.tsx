import { Flex, Text } from "@radix-ui/themes";
import Modal from "../Modal";
import theme from "../../theme";
import { OpenPositionData } from "../../types/positionTypes";
import { useEffect, useState } from "react";
import {
  ErrorUnwindStateData,
  SuccessUnwindStateData,
  UnwindStateData,
} from "../../types/tradeStateTypes";
import useSDK from "../../hooks/useSDK";
import useAccount from "../../hooks/useAccount";
import { toWei } from "overlay-sdk";
import useTypeGuard from "../../hooks/useTypeGuard";
import Loader from "../Loader";
import UnwindPosition from "./UnwindPosition";
import PositionNotFound from "./PositionNotFound";
import WithdrawOVL from "./WithdrawOVL";

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
  const isSuccessUnwindStateData = useTypeGuard<SuccessUnwindStateData>("pnl");
  const isErrorUnwindStateData = useTypeGuard<ErrorUnwindStateData>("error");

  const [unwindState, setUnwindState] = useState<UnwindStateData | undefined>(
    undefined
  );
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    let isCancelled = false; // Flag to track if the effect should be cancelled

    const fetchUnwindState = async () => {
      if (position && account && open) {
        try {
          const unwindState = await sdk.trade.getUnwindState(
            position.marketAddress,
            account,
            position.positionId,
            toWei(inputValue),
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

    fetchUnwindState();

    // Cleanup function to cancel the fetch if conditions change
    return () => {
      isCancelled = true;
    };
  }, [position, account, inputValue, open]);

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

      {isSuccessUnwindStateData(unwindState) && (
        <UnwindPosition
          position={position}
          unwindState={unwindState}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      )}

      {isErrorUnwindStateData(unwindState) && unwindState.isShutdown && (
        <WithdrawOVL position={position} unwindState={unwindState} />
      )}

      {isErrorUnwindStateData(unwindState) && !unwindState.isShutdown && (
        <PositionNotFound />
      )}
    </Modal>
  );
};

export default PositionUnwindModal;
