import { Address } from "viem";

export enum SelectState {
  LOADING = 'loading',
  EMPTY = 'empty',
  DEFAULT = 'default',
  SELECTED = 'selected',
}

export interface Token {
  address: Address,
  chainId: number,
}