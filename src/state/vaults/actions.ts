import {createAction} from '@reduxjs/toolkit'
import { StakingPool } from '@steerprotocol/sdk'
import { CalculatedVaultData, UserStats } from '../../types/vaultTypes'

export const updateVaults = createAction<{
  vaults: StakingPool[]
}>('/vaults/updateVaults')

export const updateVaultsDetails = createAction<{
  vaultsDetails: CalculatedVaultData[]
}>('/vaults/updateVaultsDetails')

export const updateUserStats = createAction<{
  userStats: UserStats
}>('/vaults/updateUserStats')