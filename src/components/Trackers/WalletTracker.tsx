import { useEffect, useRef } from "react";
import useAccount from "../../hooks/useAccount";
import { trackEvent } from "../../utils/analytics";

const WalletTracker = () => {
  const { address } = useAccount();
  const prevAddress = useRef<string | null>(null);

  useEffect(() => {
    if (address && prevAddress.current === null) {
      trackEvent("connect_wallet_click", {
        address,
        timestamp: new Date().toISOString(),
      });
    }
    prevAddress.current = address ?? null;
  }, [address]);

  return null;
};

export default WalletTracker;
