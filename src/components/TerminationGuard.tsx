import { useEffect, useRef } from "react";
import useAccount from "../hooks/useAccount";
import { useAvatarTrading } from "../hooks/useAvatarTrading";
import { useFundedTraderStats } from "../hooks/useFundedTraderStats";
import { useAddPopup, useActivePopups } from "../state/application/hooks";

const DISMISSED_KEY = "terminated-dismissed";
const PENDING_KEY = "termination-pending";

const REASON_LABELS: Record<string, string> = {
  DAILY_THRESHOLD: "daily loss limit exceeded",
  COLLATERAL_THRESHOLD: "max loss limit exceeded",
  FUNDING_THRESHOLD: "max loss limit exceeded",
};

function formatReasons(reasons: string[]): string {
  if (reasons.length === 0) return "";
  return reasons.map((r) => REASON_LABELS[r] || r.toLowerCase().replace(/_/g, " ")).join(", ");
}

/**
 * Global guard that detects funded account termination.
 *
 * Two independent paths ensure the popup survives page reloads:
 *
 * 1. **Live detection** (first useEffect): when the API returns phase "terminated"
 *    while avatar trading is active, persist the termination info to localStorage
 *    and deactivate avatar trading.
 *
 * 2. **Mount recovery** (second useEffect): on every mount, check localStorage for
 *    a pending termination and show the popup — regardless of isAvatarTradingActive.
 *
 * 3. **Dismiss tracking** (third useEffect): when the popup was seen in activePopups
 *    and then disappears (user clicked X), write the dismissed key.
 */
const TerminationGuard: React.FC = () => {
  const { address, isAvatarTradingActive } = useAccount();
  const { setStatus } = useAvatarTrading();
  const { data: fundedStats } = useFundedTraderStats(address, isAvatarTradingActive);
  const addPopup = useAddPopup();
  const activePopups = useActivePopups();
  const handledRef = useRef(false);
  const popupKeyRef = useRef<string | null>(null);
  const popupAppearedRef = useRef(false);

  // 1. Live detection: persist pending termination and deactivate avatar trading
  useEffect(() => {
    if (
      fundedStats?.phase !== "terminated" ||
      !isAvatarTradingActive ||
      handledRef.current
    ) return;

    const txHash = fundedStats.transactionHash;

    if (txHash && localStorage.getItem(`${DISMISSED_KEY}:${txHash}`) === "true") {
      setStatus("inactive");
      handledRef.current = true;
      return;
    }

    const reasons = formatReasons(fundedStats.breachReasons);
    const message = reasons
      ? `Your funded trading account was closed (${reasons}). Switched back to personal trading.`
      : "Your funded trading account was closed due to a risk limit breach. Switched back to personal trading.";

    const key = `terminated-${txHash}`;
    popupKeyRef.current = key;
    popupAppearedRef.current = false;

    localStorage.setItem(PENDING_KEY, JSON.stringify({ txHash, message }));
    addPopup({ message }, key, null);
    setStatus("inactive");
    handledRef.current = true;
  }, [fundedStats, isAvatarTradingActive]);

  // 2. Mount recovery: show popup from localStorage (no isAvatarTradingActive needed)
  useEffect(() => {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;

    let txHash: string, message: string;
    try {
      ({ txHash, message } = JSON.parse(raw));
    } catch {
      localStorage.removeItem(PENDING_KEY);
      return;
    }

    if (localStorage.getItem(`${DISMISSED_KEY}:${txHash}`) === "true") {
      localStorage.removeItem(PENDING_KEY);
      return;
    }

    const key = `terminated-${txHash}`;
    popupKeyRef.current = key;
    popupAppearedRef.current = false;
    addPopup({ message }, key, null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Dismiss tracking: wait until popup is seen in activePopups, then
  //    treat its disappearance as user dismissal (clicked X).
  useEffect(() => {
    if (!popupKeyRef.current) return;

    const stillActive = activePopups.some((p) => p.key === popupKeyRef.current);

    if (stillActive) {
      popupAppearedRef.current = true;
      return;
    }

    if (popupAppearedRef.current) {
      const txHash = popupKeyRef.current.replace("terminated-", "");
      localStorage.setItem(`${DISMISSED_KEY}:${txHash}`, "true");
      localStorage.removeItem(PENDING_KEY);
      popupAppearedRef.current = false;
      popupKeyRef.current = null;
    }
  }, [activePopups]);

  return null;
};

export default TerminationGuard;
