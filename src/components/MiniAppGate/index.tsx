import { PropsWithChildren } from "react";
import useMiniAppSdk from "../../providers/MiniAppSdkProvider/useMiniAppSdk";
import { lemonAuthConfig } from "../../config/lemonAuth";
import theme from "../../theme";

const gateEnabled = lemonAuthConfig.requireWebView;

const MiniAppGate: React.FC<PropsWithChildren> = ({ children }) => {
  const { isWebViewEnvironment } = useMiniAppSdk();

  if (gateEnabled && !isWebViewEnvironment) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.color.black,
          color: "white",
          textAlign: "center",
          padding: "32px",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "16px" }}>Open in Lemon Cash</h2>
          <p>
            This experience is designed to run inside the Lemon Cash app. Please
            open the mini app using the Lemon deeplink or QR code provided.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MiniAppGate;
