import { Chain } from "viem";
import BartioLogo from "../assets/images/bartio-logo.png";

export enum SUPPORTED_CHAINID {
  BERACHAIN = 80094,
}

export const DEFAULT_NET = SUPPORTED_CHAINID[80094];
export const DEFAULT_CHAINID: number | Chain = SUPPORTED_CHAINID.BERACHAIN;

export const WORKING_CHAINS = [
  SUPPORTED_CHAINID[SUPPORTED_CHAINID.BERACHAIN],
];

export const NETWORK_ICONS: {
  [chainId in SUPPORTED_CHAINID | number]: string;
} = {
  [SUPPORTED_CHAINID.BERACHAIN]: BartioLogo, 
};