import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  authenticate,
  isWebView as detectWebView,
  TransactionResult,
} from "@lemoncash/mini-app-sdk";
import {
  MiniAppSdkContext,
  MiniAppSdkContextValue,
} from "./context";
import {
  requestLemonNonce,
  verifyLemonSignature,
} from "../../services/lemonAuth";

const MiniAppSdkProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isWebViewEnvironment, setIsWebViewEnvironment] = useState(false);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const hasAttemptedAuthRef = useRef(false);

  useEffect(() => {
    setIsWebViewEnvironment(detectWebView());
  }, []);

  const runAuthenticate = useCallback(async () => {
    if (!isWebViewEnvironment) {
      setWalletAddress(undefined);
      return;
    }

    setIsAuthenticating(true);
    setError(undefined);

    try {
      const nonce = await requestLemonNonce();
      const result = await authenticate(nonce ? { nonce } : undefined);

      if (result.result === TransactionResult.SUCCESS) {
        const { wallet, signature, message } = result.data;

        if (nonce) {
          const verified = await verifyLemonSignature({
            wallet,
            signature,
            message,
            nonce,
          });

          if (!verified) {
            setWalletAddress(undefined);
            setError("Signature verification failed");
            return;
          }
        }

        setWalletAddress(wallet as `0x${string}`);
        setError(undefined);
      } else if (result.result === TransactionResult.FAILED) {
        setError(result.error.message);
      } else {
        setError("Authentication cancelled");
      }
    } catch (sdkError) {
      setWalletAddress(undefined);
      setError(
        sdkError instanceof Error
          ? sdkError.message
          : "Failed to authenticate",
      );
    } finally {
      setIsAuthenticating(false);
      hasAttemptedAuthRef.current = true;
    }
  }, [isWebViewEnvironment]);

  useEffect(() => {
    if (
      isWebViewEnvironment &&
      !walletAddress &&
      !isAuthenticating &&
      !hasAttemptedAuthRef.current
    ) {
      runAuthenticate();
    }
  }, [isWebViewEnvironment, walletAddress, isAuthenticating, runAuthenticate]);

  const value: MiniAppSdkContextValue = useMemo(
    () => ({
      isWebViewEnvironment,
      walletAddress,
      isAuthenticating,
      error,
      authenticate: runAuthenticate,
    }),
    [isWebViewEnvironment, walletAddress, isAuthenticating, error, runAuthenticate],
  );

  return (
    <MiniAppSdkContext.Provider value={value}>
      {children}
    </MiniAppSdkContext.Provider>
  );
};

export default MiniAppSdkProvider;
