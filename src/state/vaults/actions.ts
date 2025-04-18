import {createAction} from '@reduxjs/toolkit'
import { CalculatedVaultData, UserStats } from '../../types/vaultTypes'

export const updateVaultsDetails = createAction<{
  vaultsDetails: CalculatedVaultData[]
}>('/vaults/updateVaultsDetails')

export const updateUserStats = createAction<{
  userStats: UserStats
}>('/vaults/updateUserStats')