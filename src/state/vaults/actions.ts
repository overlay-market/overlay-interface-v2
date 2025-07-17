import {createAction} from '@reduxjs/toolkit'
import { CalculatedVaultData } from '../../types/vaultTypes'

export enum DefaultTxnSettings { 
  DEFAULT_STAKE_SLIPPAGE = '1',
};

export const updateVaultsDetails = createAction<{
  vaultsDetails: CalculatedVaultData[]
}>('/vaults/updateVaultsDetails')
export const setSlippage = createAction<{ slippageValue: DefaultTxnSettings | string }>('/vaults/setSlippage');
