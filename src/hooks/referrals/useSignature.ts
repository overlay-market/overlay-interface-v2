import { useState } from "react";
import { useSignTypedData } from "wagmi";

export const useSignature = () => {
  const { signTypedDataAsync } = useSignTypedData();
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  const fetchSignature = async (affiliate: string) => {
    setFetchingSignature(true);
    setSignatureError(null);

    const domain = { name: "Overlay Referrals", version: "1.0" };
    const types = { AffiliateTo: [{ name: "affiliate", type: "address" }] };
    const primaryType = "AffiliateTo";
    const message = { affiliate: affiliate.toLowerCase() };

    try {
      const signature = await signTypedDataAsync({ domain, types, primaryType, message });
      return signature;
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Unexpected error while signing";
      setSignatureError(msg);
      console.error("Error fetching signature:", err);
      return null;
    } finally {
      setFetchingSignature(false);
    }
  };

  return { fetchSignature, fetchingSignature, signatureError };
};