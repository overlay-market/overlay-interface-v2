import { useCallback } from "react";
import { IChartingLibraryWidget, EntityId } from "../../../../charting_library";

type PriceLineType = "ask" | "bid";

export default function usePriceLines(tvWidgetRef: { current: IChartingLibraryWidget | null }, askLineRef: React.MutableRefObject<EntityId | null>, bidLineRef: React.MutableRefObject<EntityId | null> ) {

  const createOrReplace = useCallback((chart: any, prev: EntityId | null, time: number, price: number, type: PriceLineType) => {
    const attrs = type === "ask"
      ? {
          shape: "horizontal_line",
          lock: true,
          disableSelection: true,
          disableSave: true,
          disableUndo: true,
          filled: false,
          zOrder: "top",
          overrides: {
            linecolor: "#089981",
            linewidth: 1,
            text: "ask",
            showLabel: true,
            textcolor: "#089981",
            horzLabelsAlign: "right",
            vertLabelsAlign: "bottom",
          },
        }
      : {
          shape: "horizontal_line",
          lock: true,
          disableSelection: true,
          disableSave: true,
          disableUndo: true,
          filled: false,
          zOrder: "top",
          overrides: {
            linecolor: "#f23645",
            linewidth: 1,
            textcolor: "#f23645",
            text: "bid",
            showLabel: true,
            horzLabelsAlign: "right",
            vertLabelsAlign: "top",
          },
        };

    try {
      const newEnt = chart.createMultipointShape([{ time, price }], attrs);
      if (prev) {
        try { chart.removeEntity(prev); } catch (e) { /* ignore */ }
      }
      return newEnt as EntityId;
    } catch (err) {
      console.error("createOrReplace price line failed:", err);
      return prev;
    }
  }, []);

  const setAskLine = useCallback((price?: number) => {
    if (!tvWidgetRef.current || price === undefined) return;
    try {
      const chart = tvWidgetRef.current.activeChart();
      if (!chart) return;
      const now = Date.now() / 1000;

      if (askLineRef.current) {
        const newAskLine = createOrReplace(chart, askLineRef.current, now, price, "ask");
         
        if (newAskLine) {
          askLineRef.current = newAskLine as EntityId;
        }
      } else {
        const newAskLine = createOrReplace(chart, null, now, price, "ask");

        if (newAskLine) {
          askLineRef.current = newAskLine as EntityId; 
        } 
      }
    } catch (err) {
      console.error("setAskLine error:", err);
    }
  }, [tvWidgetRef, createOrReplace]);

  const setBidLine = useCallback((price?: number) => {
    if (!tvWidgetRef.current || price === undefined) return;
    try {
      const chart = tvWidgetRef.current.activeChart();
      if (!chart) return;
      const now = Date.now() / 1000;

      if (bidLineRef.current) {
        const newBidLine = createOrReplace(chart, bidLineRef.current, now, price, "bid");
      
        if (newBidLine) {
          bidLineRef.current = newBidLine as EntityId;
        }
      } else {
        const newBidLine = createOrReplace(chart, null, now, price, "bid");

        if (newBidLine) {
          bidLineRef.current = newBidLine as EntityId; 
        }           
      }
    } catch (err) {
      console.error("setBidLine error:", err);
    }
  }, [tvWidgetRef, createOrReplace]);

  return { setAskLine, setBidLine };
}