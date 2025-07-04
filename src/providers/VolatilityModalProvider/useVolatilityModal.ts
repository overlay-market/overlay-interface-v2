import { useContext } from "react";
import { ModalContext } from "./types";

export const useVolatilityModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useVolatilityModal must be used within a VolatilityModalProvider");
  }
  return context;
};