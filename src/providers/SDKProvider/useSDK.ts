import { OverlaySDK } from "overlay-sdk";
import { useContext } from "react";
import { SDKContext } from "./types";

const useSDK = (): OverlaySDK => {
  const sdk = useContext(SDKContext);
  if (!sdk) {
    throw new Error("useSDK must be used within an SDKProvider");
  }
  return sdk;
};

export default useSDK;