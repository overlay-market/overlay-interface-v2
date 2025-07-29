import { Address } from "viem";
import {  REFERRAL_API_BASE_URL } from "../../../constants/applications";
import { UserReferralData } from "../types";

export const fetchUserReferralData = async (
  account: Address,
  setFetchingReferralsData: (value: boolean) => void,
  sessionId?: string,
): Promise<UserReferralData | undefined> => {
  setFetchingReferralsData(true);
  
  try {
    const response = await fetch(
      REFERRAL_API_BASE_URL +
        `/sessions/${sessionId ?? "current"}/trader/${account}`
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as UserReferralData;
  } catch (error) {
    console.error("Error in getting user referrals  data:", error);
    return undefined;
  } finally {
    setFetchingReferralsData(false);
  }
};