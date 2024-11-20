import { OverlaySDK } from "overlay-sdk";
import { createContext } from "react";

type SDKContextValue = OverlaySDK;

export const SDKContext = createContext<SDKContextValue | null>(null);