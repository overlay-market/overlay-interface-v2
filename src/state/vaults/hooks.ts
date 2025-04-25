import {AppState} from '../state'
import {useAppDispatch, useAppSelector} from '../hooks'
import { useCallback } from 'react';
import { updateVaultsDetails } from './actions';
import { CalculatedVaultData } from '../../types/vaultTypes';

export function useVaultsState(): AppState['vaults'] {
  return useAppSelector(state => state.vaults)
}

export const useVaultsActionHandlers = (): {
  handleVaultDetailsUpdate: (vaultsdetails: CalculatedVaultData[]) => void;
} => {
  const dispatch = useAppDispatch();

  const handleVaultDetailsUpdate = useCallback(
    (vaultsDetails: CalculatedVaultData[]) => {
      dispatch(updateVaultsDetails({ vaultsDetails }))
    },
    [dispatch]
  )

  return {
    handleVaultDetailsUpdate,
  }
};