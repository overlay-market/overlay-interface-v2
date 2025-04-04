import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSDK from "../../providers/SDKProvider/useSDK";
import usePrevious from "../../hooks/usePrevious";
import { selectPowerCards, updateTxnHash } from "./slice";
import { toast } from "react-hot-toast";

export function useIsNewTxnHashCallback() {
  const dispatch = useDispatch();
  const sdk = useSDK();

  return useCallback(
    async (txnHash: string, txnBlockNumber: number) => {
      console.log("🔍 Checking subgraph block for txn:", txnHash);

      toast.loading("Waiting for transaction confirmation...", { id: txnHash });

      const checkSubgraphBlock = async () => {
        const lastSubgraphBlock =
          await sdk.core.getLastSubgraphProcessedBlock();

        if (lastSubgraphBlock > txnBlockNumber) {
          console.log("✨ Updating PowerCards transaction hash state");
          dispatch(updateTxnHash(txnHash));
          toast.success("Transaction confirmed!", { id: txnHash });
        } else {
          console.log("⏳ Waiting for subgraph to catch up...");
          setTimeout(checkSubgraphBlock, 1000);
        }
      };

      checkSubgraphBlock();
    },
    [dispatch, sdk]
  );
}

export const useIsPowerCardsNewTxnHash = (): boolean => {
  const { txnHash } = useSelector(selectPowerCards);
  const previousTxnHash = usePrevious(txnHash);

  const isNew = txnHash !== "" && txnHash !== previousTxnHash;
  if (isNew) {
    console.log("🆕 New PowerCards transaction detected:", txnHash);
  }

  return isNew;
};
