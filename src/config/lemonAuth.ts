const lemonNonceEndpoint = import.meta.env.VITE_LEMON_AUTH_NONCE_ENDPOINT as
  | string
  | undefined;
const lemonVerifyEndpoint = import.meta.env.VITE_LEMON_AUTH_VERIFY_ENDPOINT as
  | string
  | undefined;
const requireWebView = import.meta.env.VITE_REQUIRE_LEMON_WEBVIEW === "true";

export const lemonAuthConfig = {
  nonceEndpoint: lemonNonceEndpoint,
  verifyEndpoint: lemonVerifyEndpoint,
  requireWebView,
};

export const isNonceConfigured = (): boolean =>
  Boolean(lemonAuthConfig.nonceEndpoint);

export const isVerifyConfigured = (): boolean =>
  Boolean(lemonAuthConfig.verifyEndpoint);
