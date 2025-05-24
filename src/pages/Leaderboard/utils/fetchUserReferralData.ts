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
      let errorMessage = `Error ${response.status}`;
      
      errorMessage = data.error || errorMessage;

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error in getting user referrals  data:", error);
    return undefined;
  } finally {
    setFetchingReferralsData(false);
  }
};