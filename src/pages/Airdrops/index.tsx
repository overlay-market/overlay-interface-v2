import { Flex, Text } from "@radix-ui/themes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LineSeparator, AirdropsContainer } from "./airdrops-styles";
import InfoSection from "./InfoSection";
import AddressCheckSection from "./AddressCheckSection";
import {
  AddressResults,
  AddressRowsType,
  AirdropAmount,
  ResponseDataType,
} from "./types";
import {
  AIRDROP_CHECKER_API,
  AirdropMap,
  AIRDROPS,
  AirdropStatus,
  AirdropType,
} from "../../constants/airdrops";
import { formatUnits } from "viem";
import theme from "../../theme";
import EligibilitySection from "./EligibilitySection";
import TitleSection from "./TitleSection";

const Airdrops: React.FC = () => {
  const [addresses, setAddresses] = useState<string>("");
  const [validAddresses, setValidAddresses] = useState<string[] | undefined>(
    []
  );
  const [detectedInvalidAddresses, setDetectedInvalidAddresses] =
    useState<boolean>(false);
  const [isCheckBtnClicked, setIsCheckBtnClicked] = useState(false);
  const [responseData, setResponseData] = useState<ResponseDataType | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const getAirdrops = (isActive: boolean) => {
    const convertMapToObject = (map: Map<string, AirdropType>) =>
      Object.fromEntries(map.entries());

    const filteredAirdrops = new Map<string, AirdropType>();
    const statusArray = isActive
      ? [AirdropStatus.ACTIVATED, AirdropStatus.COMING_SOON]
      : [AirdropStatus.TBA];

    Object.keys(AIRDROPS)
      .filter((airdropId) => statusArray.includes(AIRDROPS[airdropId].status))
      .forEach((airdropId) => {
        return filteredAirdrops.set(airdropId, AIRDROPS[airdropId]);
      });

    return convertMapToObject(filteredAirdrops);
  };

  const activeAirdrops: AirdropMap = getAirdrops(true); // activated and coming soon
  const TBAairdrops: AirdropMap = getAirdrops(false); // TBA
  const allAirdrops: AirdropMap = { ...activeAirdrops, ...TBAairdrops };
  const activeAirdropsKeys = Object.keys(activeAirdrops).map((airdrop) =>
    airdrop.toUpperCase().replace(/-/g, "_")
  );

  const requestData = useMemo(() => {
    const processedAddresses = addresses
      .split("\n")
      .filter((el) => el.trim())
      .map((el) => el.trim())
      .map((el) => el.toLowerCase());

    const refinedAddresses = Array.from(new Set(processedAddresses)); // get rid of duplicates

    return {
      users: refinedAddresses,
      airdrops: activeAirdropsKeys,
    };
  }, [addresses, activeAirdropsKeys]);

  const handleAddressesCheck = async () => {
    if (requestData.users.length > 0) {
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
        setIsCheckBtnClicked(true);
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

  const invalidAddresses = useMemo<string[] | null>(() => {
    if (responseData) {
      return responseData.invalidAddresses;
    } else return null;
  }, [responseData]);

  useEffect(() => {
    if (isCheckBtnClicked && invalidAddresses) {
      setValidAddresses(
        requestData.users.filter((user) => !invalidAddresses.includes(user))
      );
      setDetectedInvalidAddresses(invalidAddresses.length > 0);
      setIsCheckBtnClicked(false);
    }
  }, [isCheckBtnClicked, invalidAddresses]);

  const generateAddressRows = useCallback(() => {
    let addressRows: AddressRowsType = {};

    if (addressResults) {
      // get addressRows when there are active airdrops
      Object.keys(addressResults).forEach((address) => {
        addressRows = {
          ...addressRows,
          [address]: [],
        };

        activeAirdropsKeys.forEach((airdropId) => {
          const airdropIdAmount = addressResults[address].find(
            (item) => item.airdropID === airdropId
          )!;
          addressRows[address].push(
            airdropIdAmount["amount"]
              ? (Number(airdropIdAmount["amount"]) / 1e18).toFixed(0).toString()
              : "N/A"
          );
        });

        Object.keys(TBAairdrops).forEach(() =>
          addressRows[address].push("TBA")
        );
      });

      // get addressRows when there are no active airdrops
      if (validAddresses && activeAirdropsKeys.length === 0) {
        validAddresses.forEach((address) => {
          addressRows = {
            ...addressRows,
            [address]: [],
          };

          Object.keys(TBAairdrops).forEach(() =>
            addressRows[address].push("TBA")
          );
        });
      }
    }

    return addressRows;
  }, [addressResults, activeAirdropsKeys, validAddresses, TBAairdrops]);

  const getTotalAmountValues = useCallback(() => {
    let totalAmountValues: string[] = [];

    let airdropMaps = Object.keys(activeAirdrops).map((airdrop) => {
      const newAirdropMap = new Map();
      newAirdropMap.set(airdrop, []);
      return newAirdropMap;
    });

    if (addressResults) {
      Object.keys(addressResults).forEach((address: string) => {
        let addressAmounts: (string | null)[] = [];

        addressResults[address].map((airdropAmount: AirdropAmount) =>
          addressAmounts.push(airdropAmount["amount"])
        );

        airdropMaps.forEach((airdropMap, idx) => {
          const airdropKey = airdropMap.keys().next().value;
          airdropMap.set(airdropKey, [
            ...airdropMap.get(airdropKey),
            addressAmounts[idx],
          ]);
        });
      });

      airdropMaps.forEach((airdropMap) => {
        const airdropKey = airdropMap.keys().next().value;
        const airdropValues = airdropMap.get(airdropKey);
        let totalValue: string;

        if (airdropValues.every((value: string | null) => value === null)) {
          totalValue = "N/A";
        } else {
          const totalInWei = airdropValues.reduce(
            (accumulator: bigint, currentValue: string | null) => {
              if (currentValue === null) return accumulator;
              return accumulator + BigInt(currentValue);
            },
            BigInt(0)
          );

          totalValue = Number(formatUnits(totalInWei, 18))
            .toFixed(0)
            .toString();
        }

        airdropMap.set(airdropKey, totalValue);
      });

      airdropMaps.forEach((airdropMap) => {
        const airdropKey = airdropMap.keys().next().value;
        totalAmountValues.push(airdropMap.get(airdropKey));
      });

      Object.keys(TBAairdrops).map(() => totalAmountValues.push("TBA"));
    }

    return totalAmountValues;
  }, [addressResults, activeAirdrops, TBAairdrops]);

  const addressAirdropRows = useMemo<AddressRowsType | null>(() => {
    return addressResults ? generateAddressRows() : null;
  }, [addressResults, generateAddressRows]);

  const totalAmountValues = useMemo<string[] | null>(() => {
    return addressResults ? getTotalAmountValues() : null;
  }, [addressResults, getTotalAmountValues]);

  return (
    <AirdropsContainer direction="column" width={"100%"} overflowX={"hidden"}>
      <Flex
        justify={{ initial: "center", sm: "start" }}
        align={{ initial: "end", sm: "center" }}
        width={"100%"}
        height={theme.headerSize.height}
        px={"8px"}
        display={{ initial: "none", sm: "flex" }}
      >
        <Text
          size={{ initial: "5", sm: "2" }}
          weight={{ initial: "bold", sm: "medium" }}
        >
          Airdrops
        </Text>
      </Flex>
      <LineSeparator />

      <Flex
        direction="column"
        width={"100%"}
        pl={{ initial: "0px", sm: "20px" }}
      >
        <TitleSection />
        <AddressCheckSection
          addresses={addresses}
          setAddresses={setAddresses}
          handleAddressesCheck={handleAddressesCheck}
          detectedInvalidAddresses={detectedInvalidAddresses}
          setDetectedInvalidAddresses={setDetectedInvalidAddresses}
          loading={loading}
        />

        <EligibilitySection
          airdrops={allAirdrops}
          addressAirdropRows={addressAirdropRows}
          totalAmountValues={totalAmountValues}
        />
        {/* <InfoSection /> */}
      </Flex>
    </AirdropsContainer>
  );
};

export default Airdrops;
