import { createContext } from "react";

type ModalContextType = {
  showVolatilityWarning: (volatilityPercent: string) => Promise<boolean>;
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);