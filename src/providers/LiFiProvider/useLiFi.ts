import { useContext } from "react";
import { LiFiContext } from ".";

export const useLiFiConfig = () => {
  const ctx = useContext(LiFiContext);
  if (!ctx) throw new Error("useLiFiConfig must be used within a LiFiProvider");
  return ctx;
};