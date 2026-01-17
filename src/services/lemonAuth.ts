import { lemonAuthConfig } from "../config/lemonAuth";

type NonceResponse = {
  nonce: string;
};

type VerifyPayload = {
  wallet: string;
  signature: string;
  message: string;
  nonce: string;
};

type VerifyResponse = {
  verified: boolean;
  wallet?: string;
  error?: string;
};

const ensureNonce = (nonce: string): string => {
  if (!nonce || nonce.length < 8) {
    throw new Error("Nonce returned from backend is invalid");
  }

  // backend should ensure alphanumeric, but guard against whitespace
  return nonce.trim();
};

export const requestLemonNonce = async (): Promise<string | undefined> => {
  const { nonceEndpoint } = lemonAuthConfig;

  if (!nonceEndpoint) return undefined;

  const response = await fetch(nonceEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to request Lemon nonce (${response.status}): ${message}`,
    );
  }

  const data = (await response.json()) as NonceResponse;
  return ensureNonce(data.nonce);
};

export const verifyLemonSignature = async (
  payload: VerifyPayload,
): Promise<boolean> => {
  const { verifyEndpoint } = lemonAuthConfig;

  if (!verifyEndpoint) return true;

  const response = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to verify Lemon signature (${response.status}): ${message}`,
    );
  }

  const data = (await response.json()) as VerifyResponse;
  return Boolean(data.verified);
};
