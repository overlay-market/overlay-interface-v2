import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AddressResults, AirdropsAmounts, ResponseDataType } from "./types";
import {
  AIRDROP_CHECKER_API,
  AirdropMap,
  AIRDROPS,
  AirdropStatus,
  AirdropType,
  ClaimId,
} from "../../constants/airdrops";
import EligibilityChecker from "./EligibilityChecker";
import AirdropsClaim from "./AirdropsClaim";
import useAccount from "../../hooks/useAccount";
import { trackEvent } from "../../utils/analytics";

export enum EligibilityStatus {
  Eligible = "eligible",
  EligibleNoRewards = "eligibleNoRewards",
  Ineligible = "ineligible",
  Null = "null",
}

const Airdrops: React.FC = () => {
  const { address: account } = useAccount();

  const [address, setAddress] = useState<string>("");
  const [responseData, setResponseData] = useState<ResponseDataType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState(
    EligibilityStatus.Null
  );
  const [disqualifiedTorch, setDisqualifiedTorch] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (account) {
      setAddress(account);
    } else {
      setAddress("");
    }
  }, [account]);

  useEffect(() => {
    setEligibilityStatus(EligibilityStatus.Null);
  }, [address]);

  const getAirdrops = (isActive: boolean) => {
    const convertMapToObject = (map: Map<string, AirdropType>) =>
      Object.fromEntries(map.entries());

    const filteredAirdrops = new Map<string, AirdropType>();
    const status = isActive
      ? AirdropStatus.ACTIVATED
      : AirdropStatus.COMING_SOON;

    Object.keys(AIRDROPS)
      .filter((airdropId) => AIRDROPS[airdropId].status === status)
      .forEach((airdropId) => {
        return filteredAirdrops.set(airdropId, AIRDROPS[airdropId]);
      });

    return convertMapToObject(filteredAirdrops);
  };

  const activeAirdrops: AirdropMap = getAirdrops(true);
  const activeAirdropKeys = Object.keys(activeAirdrops);

  const requestData = useMemo(() => {
    const processedAddress = address.trim().toLowerCase();

    if (processedAddress.length > 0 && activeAirdropKeys.length > 0) {
      return {
        users: [processedAddress],
        airdrops: activeAirdropKeys,
      };
    } else {
      if (activeAirdropKeys.length === 0) {
        console.log("No active airdrop");
      }
      return null;
    }
  }, [address, activeAirdropKeys]);

  const handleAddressesCheck = async () => {
    if (requestData) {
      try {
        setLoading(true);
        const response = await fetch(AIRDROP_CHECKER_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ResponseDataType = await response.json();
        setResponseData(data);
      } catch (error: unknown) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addressResults = useMemo<AddressResults | null>(() => {
    if (responseData) {
      return responseData.addressResults;
    } else return null;
  }, [responseData]);

  const getAirdropsAmounts = useCallback(() => {
    let airdropsAmounts: AirdropsAmounts = {};

    if (addressResults) {
      Object.keys(addressResults).forEach((address) => {
        activeAirdropKeys.forEach((airdropId) => {
          const airdropIdAmount = addressResults[address].find(
            (item) => item.airdropID === airdropId
          )!;

          if (airdropIdAmount && airdropIdAmount["amount"]) {
            airdropsAmounts[airdropId] = (
              Number(airdropIdAmount["amount"]) / 1e18
            )
              .toFixed(2)
              .toString();
          }
        });
      });
    }

    return airdropsAmounts;
  }, [addressResults, activeAirdropKeys]);

  useEffect(() => {
    if (addressResults) {
      Object.keys(addressResults).forEach((address) => {
        activeAirdropKeys.forEach((airdropId) => {
          const airdropIdAmount = addressResults[address].find(
            (item) => item.airdropID === airdropId
          )!;

          if (
            airdropIdAmount &&
            airdropIdAmount["amount"] &&
            airdropId === ClaimId.TORCH
          ) {
            setDisqualifiedTorch(airdropIdAmount.disqualified ?? null);
          }
        });
      });
    }
  }, [addressResults, activeAirdropKeys]);

  const airdropsAmounts = useMemo<AirdropsAmounts | null>(() => {
    return addressResults ? getAirdropsAmounts() : null;
  }, [addressResults, getAirdropsAmounts]);

  const noRewardsAvailable = useMemo<boolean | null>(() => {
    return airdropsAmounts ? Object.keys(airdropsAmounts).length === 0 : null;
  }, [airdropsAmounts]);

  useEffect(() => {
    if (responseData) {
      const invalidAddresses = responseData.invalidAddresses;
      if (invalidAddresses) {
        if (invalidAddresses.length === 0) {
          if (noRewardsAvailable) {
            setEligibilityStatus(EligibilityStatus.EligibleNoRewards);
          } else {
            setEligibilityStatus(EligibilityStatus.Eligible);
          }
        } else {
          setEligibilityStatus(EligibilityStatus.Ineligible);
        }
      } else {
        setEligibilityStatus(EligibilityStatus.Null);
      }
    } else {
      setEligibilityStatus(EligibilityStatus.Null);
    }
  }, [responseData, noRewardsAvailable]);

  useEffect(() => {
    if (eligibilityStatus !== EligibilityStatus.Null && address) {
      trackEvent("airdrop_check_result", {
        address,
        eligibility_status: eligibilityStatus,
        timestamp: new Date().toISOString(),
      });
    }
  }, [eligibilityStatus, address]);

  return (
    <>
      {["eligibleNoRewards", "ineligible", "null"].includes(
        eligibilityStatus
      ) && (
        <EligibilityChecker
          eligibilityStatus={eligibilityStatus}
          address={address}
          setAddress={setAddress}
          loading={loading}
          handleAddressesCheck={handleAddressesCheck}
        />
      )}
      {eligibilityStatus === "eligible" && (
        <AirdropsClaim
          airdropsAmounts={airdropsAmounts}
          disqualifiedTorch={disqualifiedTorch}
        />
      )}
    </>
  );
};

export default Airdrops;
