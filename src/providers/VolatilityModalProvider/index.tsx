import { useCallback, useState } from "react";
import { VolatilityDialog } from "../../components/Dialog";
import { ModalContext } from "./types";

export const VolatilityModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const showVolatilityWarning = useCallback((msg: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setMessage(msg);
      setResolver(() => resolve);
      setOpen(true);
    });
  }, []);

  const handleCancel = () => {
    setOpen(false);
    resolver?.(false);
  };

  const handleContinue = () => {
    setOpen(false);
    resolver?.(true);
  };

  return (
    <ModalContext.Provider value={{ showVolatilityWarning }}>
      {children}
      <VolatilityDialog
        open={open}
        setOpen={setOpen}
        volatilityPercent={message}
        handleCancel={handleCancel}
        handleContinue={handleContinue}
      />
    </ModalContext.Provider>
  );
};
