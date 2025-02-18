import {createAction} from '@reduxjs/toolkit'
import { StakingPool } from '@steerprotocol/sdk'
import { VaultDetails } from '../../types/vaultTypes'

export const updateVaults = createAction<{
  vaults: StakingPool[]
}>('/vaults/updateVaults')

export const updateVaultsDetails = createAction<{
  vaultDetails: VaultDetails[]
}>('/vaults/updateVaultsDetails')