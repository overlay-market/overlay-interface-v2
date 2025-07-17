import React from "react";
import theme from "../../theme";
import {
  MINIMUM_STAKE_SLIPPAGE_VALUE,
  useVaultsActionHandlers,
  useVaultsState,
} from "../../state/vaults/hooks";
import { DefaultTxnSettings } from "../../state/vaults/actions";
import SlippageModal from "./SlippageModal";

export const StakeSlippageModal: React.FC = () => {
  const { slippageValue } = useVaultsState();
  const { handleSlippageSet } = useVaultsActionHandlers();

  return (
    <SlippageModal
      slippageValue={slippageValue}
      handleSlippageSet={handleSlippageSet}
      defaultSlippage={DefaultTxnSettings.DEFAULT_STAKE_SLIPPAGE}
      localStorageKey="stakeSlippage"
      minSlippageValue={MINIMUM_STAKE_SLIPPAGE_VALUE}
      colorTheme={theme.color.blue3}
    />
  );
};
