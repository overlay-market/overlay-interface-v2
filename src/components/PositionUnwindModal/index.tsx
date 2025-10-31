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
import ShareSuccess from "./ShareSuccess";
import { useTradeState, useTradeActionHandlers } from "../../state/trade/hooks";
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
  const { handleTxnHashUpdate } = useTradeActionHandlers();

  const [unwindState, setUnwindState] = useState<UnwindStateData | undefined>(
    undefined
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [unwindPercentage, setUnwindPercentage] = useState<number>(0);

  // State for handling successful unwind with profit sharing
  const [showShareSuccess, setShowShareSuccess] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{
    unwindState: UnwindStateSuccess;
    inputValue: string;
    unwindPercentage: number;
    transactionHash?: string;
    blockNumber?: number;
  } | null>(null);

  useEffect(() => {
    setInputValue("");
    setShowShareSuccess(false);
    setShareData(null);
  }, [open]);

  const handleUnwindSuccess = (
    finalUnwindState: UnwindStateSuccess,
    finalInputValue: string,
    finalUnwindPercentage: number,
    transactionHash?: string,
    blockNumber?: number
  ) => {
    // Always show share success modal for any unwind (profit or loss)
    setShareData({
      unwindState: finalUnwindState,
      inputValue: finalInputValue,
      unwindPercentage: finalUnwindPercentage,
      transactionHash,
      blockNumber,
    });
    setShowShareSuccess(true);
  };

  const handleShareModalDismiss = () => {
    // Intentionally delay transaction hash update until after share modal dismissal
    // This prevents portfolio refresh while user is viewing/sharing their results
    // Better UX: user sees their trade card without data changing underneath
    if (shareData?.transactionHash && shareData?.blockNumber) {
      handleTxnHashUpdate(shareData.transactionHash, shareData.blockNumber);
    }
    handleDismiss();
  };

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

  return (
    <>
    <Modal triggerElement={null} open={open && !showShareSuccess} handleClose={handleDismiss}>
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

      {isUnwindStateSuccess(unwindState) && !showShareSuccess && (
        <UnwindPosition
          position={position}
          unwindState={unwindState}
          inputValue={inputValue}
          setInputValue={setInputValue}
          unwindPercentage={unwindPercentage}
          setUnwindPercentage={setUnwindPercentage}
          handleDismiss={handleDismiss}
          onUnwindSuccess={handleUnwindSuccess}
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

    {/* ShareSuccess as standalone modal */}
    {showShareSuccess && shareData && (
      <ShareSuccess
        open={showShareSuccess}
        position={position}
        unwindState={shareData.unwindState}
        unwindPercentage={shareData.unwindPercentage}
        transactionHash={shareData.transactionHash}
        handleDismiss={handleShareModalDismiss}
      />
    )}
    </>
  );
};

export default PositionUnwindModal;
