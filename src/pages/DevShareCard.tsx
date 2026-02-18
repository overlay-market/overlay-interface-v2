/**
 * DEV-ONLY page for testing the share/unwind flow with real wallet data.
 * Gated behind import.meta.env.DEV — never included in production builds.
 * Route: /dev/share-card
 *
 * Connect your wallet, and this page will:
 * 1. Fetch your open positions (same as Portfolio)
 * 2. Let you click any position to simulate an unwind
 * 3. Open the real ShareSuccess modal with real unwind state data
 */
import { useEffect, useState } from "react";
import type { OpenPositionData, UnwindStateSuccess } from "overlay-sdk";
import useSDK from "../providers/SDKProvider/useSDK";
import useAccount from "../hooks/useAccount";
import ShareSuccess from "../components/PositionUnwindModal/ShareSuccess";
import theme from "../theme";

type SelectedPosition = {
  position: OpenPositionData;
  unwindState: UnwindStateSuccess;
};

const DevShareCard = () => {
  const sdk = useSDK();
  const { address: account } = useAccount();

  const [positions, setPositions] = useState<OpenPositionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedPosition | null>(null);
  const [fetchingUnwind, setFetchingUnwind] = useState<number | null>(null);

  // Fetch open positions
  useEffect(() => {
    if (!sdk || !account) {
      setPositions([]);
      return;
    }

    let cancelled = false;

    const fetchPositions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await sdk.openPositions.transformOpenPositions(
          1, 50, undefined, account, false
        );
        if (!cancelled && result?.data) {
          setPositions(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch positions:", err);
          setError(err instanceof Error ? err.message : "Failed to fetch positions");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPositions();
    return () => { cancelled = true; };
  }, [sdk, account]);

  // Click a position row → fetch unwind state → open ShareSuccess modal
  const handlePositionClick = async (position: OpenPositionData) => {
    if (!sdk || !account || fetchingUnwind !== null) return;

    setFetchingUnwind(position.positionId);
    try {
      const unwindStateData = await sdk.trade.getUnwindState(
        position.marketAddress,
        account,
        position.positionId,
        1, // 100% unwind
        1, // 1% slippage
        4,
      );

      if (!unwindStateData || !('pnl' in unwindStateData)) {
        console.error("Got error state from getUnwindState:", unwindStateData);
        return;
      }

      setSelected({
        position,
        unwindState: unwindStateData as UnwindStateSuccess,
      });
    } catch (err) {
      console.error("Failed to get unwind state:", err);
    } finally {
      setFetchingUnwind(null);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ color: "#fff", marginBottom: 8 }}>Share Card Dev Test</h1>
      <p style={{ color: "#888", marginBottom: 24 }}>
        Click any position to simulate an unwind and open the ShareSuccess modal.
      </p>

      {!account && (
        <p style={{ color: "#f59e0b" }}>Connect your wallet to see your positions.</p>
      )}
      {loading && <p style={{ color: "#888" }}>Loading positions...</p>}
      {error && <p style={{ color: "#ef4444" }}>Error: {error}</p>}

      {positions.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#ccc", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.color.darkBlue}`, textAlign: "left" }}>
              <th style={{ padding: "8px 12px" }}>Market</th>
              <th style={{ padding: "8px 12px" }}>Position</th>
              <th style={{ padding: "8px 12px" }}>Size</th>
              <th style={{ padding: "8px 12px" }}>Entry Price</th>
              <th style={{ padding: "8px 12px" }}>Current Price</th>
              <th style={{ padding: "8px 12px" }}>PnL</th>
              <th style={{ padding: "8px 12px" }}>Type</th>
              <th style={{ padding: "8px 12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const isFetching = fetchingUnwind === pos.positionId;
              return (
                <tr
                  key={`${pos.positionId}-${pos.marketAddress}`}
                  onClick={() => handlePositionClick(pos)}
                  style={{
                    borderBottom: `1px solid ${theme.color.darkBlue}`,
                    cursor: isFetching ? "wait" : "pointer",
                    opacity: isFetching ? 0.5 : 1,
                  }}
                >
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{pos.marketName}</td>
                  <td style={{ padding: "10px 12px" }}>{pos.positionSide}</td>
                  <td style={{ padding: "10px 12px" }}>{pos.size}</td>
                  <td style={{ padding: "10px 12px" }}>{pos.entryPrice}</td>
                  <td style={{ padding: "10px 12px" }}>{pos.currentPrice}</td>
                  <td style={{
                    padding: "10px 12px",
                    color: Number(pos.unrealizedPnL) >= 0 ? theme.color.green1 : "#ef4444",
                  }}>
                    {pos.unrealizedPnL}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 11, color: "#888" }}>
                    {pos.loan?.id ? "LBSC" : "OVL"}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#10DCB1" }}>
                    {isFetching ? "Loading..." : "Test Unwind →"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!loading && account && positions.length === 0 && !error && (
        <p style={{ color: "#888" }}>No open positions found.</p>
      )}

      {/* The actual ShareSuccess modal — same component used in production */}
      {selected && (
        <ShareSuccess
          open={true}
          position={selected.position}
          unwindState={selected.unwindState}
          unwindPercentage={1}
          transactionHash="0xdev-test"
          handleDismiss={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default DevShareCard;
