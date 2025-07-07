import React from "react";
import {
  MINIMUM_SLIPPAGE_VALUE,
  useTradeActionHandlers,
  useTradeState,
} from "../../state/trade/hooks";
import { DefaultTxnSettings } from "../../state/trade/actions";
import theme from "../../theme";
import SlippageModal from "./SlippageModal";

export const TradeSlippageModal: React.FC = () => {
  const { slippageValue } = useTradeState();
  const { handleSlippageSet } = useTradeActionHandlers();

  return (
    <SlippageModal
      slippageValue={slippageValue}
      handleSlippageSet={handleSlippageSet}
      defaultSlippage={DefaultTxnSettings.DEFAULT_SLIPPAGE}
      localStorageKey="slippage"
      minSlippageValue={MINIMUM_SLIPPAGE_VALUE}
      colorTheme={theme.color.blue2}
      warningHighSlippage="Caution: High slippage. Your position may result in an unfavorable trade."
      warningLowSlippage="Caution: Slippage too low. Slippage should be set to protocol minimum of 0.05%."
    />
  );
};
