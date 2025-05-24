import { Address } from "viem";
import {  REFERRAL_API_BASE_URL } from "../../../constants/applications";

export const fetchUserReferralData = async (
  account: Address,
  setFetchingReferralsData: (value: boolean) => void,
) => {
  setFetchingReferralsData(true);
  
  try {
    const response = await fetch(
      REFERRAL_API_BASE_URL +
        `/sessions/current/trader/${account}`
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || `Error ${response.status}`;
      return { data: undefined, errorMessage };
    }

    return { data, errorMessage: undefined };
  } catch (error) {
    console.error("Error in getting user referrals  data:", error);
    return { data: undefined, errorMessage: error instanceof Error ? error.message : "Unknown error" };
  } finally {
    setFetchingReferralsData(false);
  }
};