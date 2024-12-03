import { useEffect } from 'react';
import { useArcxAnalytics } from '@0xarc-io/analytics';
import { useAccount } from 'wagmi';

const WalletConnectionTracker = () => {
  const { address, chainId } = useAccount();
  const arcxSdk = useArcxAnalytics();

  useEffect(() => {
    if (address && chainId && arcxSdk) {
        arcxSdk.wallet({
        chainId,
        account: address,
      });
    }
  }, [address, chainId, arcxSdk]); // Re-run this effect if account or chainId changes

  return null; // Render nothing, as this is purely for tracking
};

export default WalletConnectionTracker;
