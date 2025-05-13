import {AppState} from '../state'
import {useAppDispatch, useAppSelector} from '../hooks'
import { useCallback } from 'react';
import { DefaultTxnSettings, setSlippage, updateVaultsDetails } from './actions';
import { CalculatedVaultData } from '../../types/vaultTypes';

export const MINIMUM_STAKE_SLIPPAGE_VALUE = 0.05;
const slippageRegex: RegExp = /^(?:\d{1,2}(?:\.\d{0,2})?|\.\d{1,2}|100(?:\.0{1,2})?)?$/;

export function useVaultsState(): AppState['vaults'] {
  return useAppSelector(state => state.vaults)
}

export const useVaultsActionHandlers = (): {
  handleVaultDetailsUpdate: (vaultsdetails: CalculatedVaultData[]) => void;
  handleSlippageSet: (slippageValue: DefaultTxnSettings | string) => void;
} => {
  const dispatch = useAppDispatch();

  const handleVaultDetailsUpdate = useCallback(
    (vaultsDetails: CalculatedVaultData[]) => {
      dispatch(updateVaultsDetails({ vaultsDetails }))
    },
    [dispatch]
  )

  const handleSlippageSet = useCallback(
    (slippageValue: DefaultTxnSettings | string) => {
      if (Number(slippageValue) < MINIMUM_STAKE_SLIPPAGE_VALUE && slippageValue.length > 3) {
        dispatch(setSlippage({slippageValue: MINIMUM_STAKE_SLIPPAGE_VALUE.toString()}))
      }
      if(slippageValue === '.') {
        dispatch(setSlippage({ slippageValue }))
      }
      if(slippageRegex.test(slippageValue)) {
        dispatch(setSlippage({ slippageValue }))
      }

      localStorage.setItem(`stakeSlippage`, slippageValue ?? DefaultTxnSettings.DEFAULT_STAKE_SLIPPAGE)
    },
    [dispatch]
  )

  return {
    handleVaultDetailsUpdate,
    handleSlippageSet,
  }
};