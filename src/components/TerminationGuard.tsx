import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AlertTriangle } from "react-feather";
import useAccount from "../hooks/useAccount";
import { useAvatarTrading } from "../hooks/useAvatarTrading";
import { useFundedTraderStats } from "../hooks/useFundedTraderStats";
import Modal from "./Modal";
import theme from "../theme";

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

type ModalData = {
  message: string;
  reasons: string;
  txHash: string;
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 8px 0 0;
  text-align: center;
`;

const Message = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const Reason = styled.p`
  font-size: 14px;
  margin: 0;
  color: ${theme.color.grey3};
`;

const Subtext = styled.p`
  font-size: 13px;
  margin: 0;
  color: ${theme.color.grey10};
`;

const DismissButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: ${theme.color.white};
  background: ${theme.color.red2};

  &:hover {
    opacity: 0.85;
  }
`;

const TerminationGuard: React.FC = () => {
  const { address, isAvatarTradingActive } = useAccount();
  const { setStatus } = useAvatarTrading();
  const { data: fundedStats } = useFundedTraderStats(address, isAvatarTradingActive);
  const handledRef = useRef(false);

  const [modalData, setModalData] = useState<ModalData | null>(null);

  const handleDismiss = useCallback(() => {
    if (!modalData) return;
    localStorage.setItem(`${DISMISSED_KEY}:${modalData.txHash}`, "true");
    localStorage.removeItem(PENDING_KEY);
    setModalData(null);
  }, [modalData]);

  // Reset state when account is reactivated (e.g. team restores TRADER_ROLE)
  useEffect(() => {
    if (!fundedStats || fundedStats.phase === "terminated" || !isAvatarTradingActive) return;

    const raw = localStorage.getItem(PENDING_KEY);
    if (raw) {
      try {
        const { txHash } = JSON.parse(raw);
        if (txHash) localStorage.removeItem(`${DISMISSED_KEY}:${txHash}`);
      } catch { /* ignore */ }
      localStorage.removeItem(PENDING_KEY);
    }

    setModalData(null);
    handledRef.current = false;
  }, [fundedStats, isAvatarTradingActive]);

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
      ? `Your funded trading account was closed (${reasons}).`
      : "Your funded trading account was closed due to a risk limit breach.";

    localStorage.setItem(PENDING_KEY, JSON.stringify({ txHash, message, reasons }));
    setModalData({ message, reasons, txHash });
    setStatus("inactive");
    handledRef.current = true;
  }, [fundedStats, isAvatarTradingActive, setStatus]);

  // 2. Mount recovery: show modal from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;

    let txHash: string, message: string, reasons: string;
    try {
      ({ txHash, message, reasons = "" } = JSON.parse(raw));
    } catch {
      localStorage.removeItem(PENDING_KEY);
      return;
    }

    if (localStorage.getItem(`${DISMISSED_KEY}:${txHash}`) === "true") {
      localStorage.removeItem(PENDING_KEY);
      return;
    }

    setModalData({ message, reasons, txHash });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      triggerElement={null}
      open={modalData !== null}
      title="Funded Account Terminated"
      width="400px"
      hideCloseButton
    >
      <Content>
        <AlertTriangle size={36} color={theme.color.grey3} />
        <Message>Your funded trading account has been closed</Message>
        {modalData?.reasons && (
          <Reason>Reason: {modalData.reasons}</Reason>
        )}
        <Subtext>You have been switched back to personal trading.</Subtext>
        <DismissButton onClick={handleDismiss}>I Understand</DismissButton>
      </Content>
    </Modal>
  );
};

export default TerminationGuard;
