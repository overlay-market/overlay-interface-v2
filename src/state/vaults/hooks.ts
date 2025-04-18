import {AppState} from '../state'
import {useAppDispatch, useAppSelector} from '../hooks'
import { useCallback } from 'react';
import { updateUserStats, updateVaultsDetails } from './actions';
import { CalculatedVaultData, UserStats } from '../../types/vaultTypes';

export function useVaultsState(): AppState['vaults'] {
  return useAppSelector(state => state.vaults)
}

export const useVaultsActionHandlers = (): {
  handleVaultDetailsUpdate: (vaultsdetails: CalculatedVaultData[]) => void;
  handleUserStatsUpdate: (userStats: UserStats) => void;
} => {
  const dispatch = useAppDispatch();

  const handleVaultDetailsUpdate = useCallback(
    (vaultsDetails: CalculatedVaultData[]) => {
      dispatch(updateVaultsDetails({ vaultsDetails }))
    },
    [dispatch]
  )

  const handleUserStatsUpdate = useCallback(
    (userStats: UserStats) => {
      dispatch(updateUserStats({ userStats }))
    },
    [dispatch]
  )

  return {
    handleVaultDetailsUpdate,
    handleUserStatsUpdate,
  }
};