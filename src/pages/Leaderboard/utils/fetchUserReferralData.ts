import { Address } from "viem";
import {  REFERRAL_API_BASE_URL } from "../../../constants/applications";
import { UserReferralData } from "../types";

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

    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;

      throw new Error(errorMessage);
    }

    const data: UserReferralData = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getting user referrals  data:", error);
    return undefined;
  } finally {
    setFetchingReferralsData(false);
  }
};