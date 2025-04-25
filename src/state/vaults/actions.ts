import {createAction} from '@reduxjs/toolkit'
import { CalculatedVaultData } from '../../types/vaultTypes'

export const updateVaultsDetails = createAction<{
  vaultsDetails: CalculatedVaultData[]
}>('/vaults/updateVaultsDetails')
