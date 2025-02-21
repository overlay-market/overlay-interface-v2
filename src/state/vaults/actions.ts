import {createAction} from '@reduxjs/toolkit'
import { StakingPool } from '@steerprotocol/sdk'
import { UserStats, VaultDetails } from '../../types/vaultTypes'

export const updateVaults = createAction<{
  vaults: StakingPool[]
}>('/vaults/updateVaults')

export const updateVaultsDetails = createAction<{
  vaultDetails: VaultDetails[]
}>('/vaults/updateVaultsDetails')

export const updateUserStats = createAction<{
  userStats: UserStats
}>('/vaults/updateUserStats')