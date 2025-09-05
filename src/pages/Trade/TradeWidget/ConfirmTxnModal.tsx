import { TradeStateData } from "overlay-sdk";
import Modal from "../../../components/Modal";
import {
  BridgeQuoteInfo,
  BridgeStage,
} from "../../../hooks/lifi/useLiFiBridge";
import ConfirmBridgeContent from "./ConfirmBridgeContent";
import ConfirmTradeContent from "./ConfirmTradeContent";

type ConfirnTxnModalProps = {
  open: boolean;
  tradeState: TradeStateData;
  bridgeStage?: BridgeStage;
  bridgeQuote?: BridgeQuoteInfo | null;
  attemptingTransaction: boolean;
  handleDismiss: () => void;
  handleTrade: () => void;
  handleBridge?: () => void;
};

const ConfirmTxnModal: React.FC<ConfirnTxnModalProps> = ({
  open,
  tradeState,
  bridgeStage,
  bridgeQuote,
  attemptingTransaction,
  handleDismiss,
  handleTrade,
  handleBridge,
}) => {
  const bridgeWithLiFi = bridgeQuote !== null;
  const confirmBridge = bridgeWithLiFi && bridgeStage?.stage !== "success";

  return (
    <Modal
      triggerElement={null}
      open={open}
      handleClose={handleDismiss}
      title={"Confirm Transaction"}
      fontSizeTitle={"16px"}
      width="352px"
      minHeight={confirmBridge ? "465px" : "565px"}
    >
      {bridgeWithLiFi && handleBridge && bridgeStage ? (
        bridgeStage.stage === "success" ? (
          <ConfirmTradeContent
            tradeState={tradeState}
            attemptingTransaction={attemptingTransaction}
            handleTrade={handleTrade}
          />
        ) : (
          <ConfirmBridgeContent
            bridgeQuote={bridgeQuote}
            bridgeStage={bridgeStage}
            handleBridge={handleBridge}
          />
        )
      ) : (
        <ConfirmTradeContent
          tradeState={tradeState}
          attemptingTransaction={attemptingTransaction}
          handleTrade={handleTrade}
        />
      )}
    </Modal>
  );
};

export default ConfirmTxnModal;
