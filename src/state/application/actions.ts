import {createAction} from '@reduxjs/toolkit'
import { TransactionType } from '../../constants/transaction'

export type PopupContent =
  | {
    txn: {
      hash: string
      success: boolean
      message: string
      type: TransactionType | number | string
    }
  } | {
    message: string;
  }

export const addPopup = createAction<{
  key?: string
  removeAfterMs?: number | null
  content: PopupContent
}>('application/addPopup')
export const removePopup = createAction<{key: string}>('application/removePopup')
