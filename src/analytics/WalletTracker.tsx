import { useEffect, useRef } from "react";
import useAccount from "../hooks/useAccount";
import { trackEvent } from "./trackEvent";

const WalletTracker = () => {
  const { address } = useAccount();
  const prevAddress = useRef<string | null>(null);

  useEffect(() => {
    if (address && prevAddress.current === null) {
      trackEvent("connect_wallet_click", {
        wallet_address: address,
        timestamp: new Date().toISOString(),
      });
    }
    prevAddress.current = address ?? null;
  }, [address]);

  return null;
};

export default WalletTracker;
