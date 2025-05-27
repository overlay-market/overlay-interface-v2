import { Address } from "viem";
import {  REFERRAL_API_BASE_URL } from "../../../constants/applications";

export const generateReferralCode = async (
  account: Address,
): Promise<{ success: boolean; error?: string }> => {
    try {
      const payload = {
        walletAddress: account,
      };

      const url = new URL(
        "/points-bsc/referral/create-referral-code",
        REFERRAL_API_BASE_URL
      );

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status === 201) {
        return { success: true };
      }

      return { success: false, error: data.error || "Unexpected error occurred." };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to generate referral code.",
      };
    } 
};