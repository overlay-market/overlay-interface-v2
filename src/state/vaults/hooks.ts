import {AppState} from '../state'
import {useAppDispatch, useAppSelector} from '../hooks'
import { useCallback } from 'react';
import { updateVaults, updateVaultsDetails } from './actions';
import { StakingPool } from '@steerprotocol/sdk';
import { VaultDetails } from '../../types/vaultTypes';

export function useVaultsState(): AppState['vaults'] {
  return useAppSelector(state => state.vaults)
}

export const useVaultsActionHandlers = (): {
  handleVaultsUpdate: (vaults: StakingPool[]) => void;
  handleVaultDetailsUpdate: (vaultdetails: VaultDetails[]) => void;
} => {
  const dispatch = useAppDispatch();

  const handleVaultsUpdate = useCallback(
    (vaults: StakingPool[]) => {
      dispatch(updateVaults({ vaults }))
    },
    [dispatch]
  )

  const handleVaultDetailsUpdate = useCallback(
    (vaultDetails: VaultDetails[]) => {
      dispatch(updateVaultsDetails({ vaultDetails }))
    },
    [dispatch]
  )

  return {
    handleVaultsUpdate,
    handleVaultDetailsUpdate
  }
};