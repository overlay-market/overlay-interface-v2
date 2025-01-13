import { Flex, Text } from "@radix-ui/themes";
import React, { Dispatch, SetStateAction } from "react";
import {
  ClearAllBtnWrapper,
  ClearAllButton,
  CloseIcon,
  InputAddressesBox,
  InputAddressesBoxContainer,
} from "./address-check-section-styles";
import theme from "../../../theme";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

interface Props {
  addresses: string;
  setAddresses: Dispatch<SetStateAction<string>>;
  handleAddressesCheck: () => Promise<void>;
  detectedInvalidAddresses: boolean;
  setDetectedInvalidAddresses: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

const AddressCheckSection: React.FC<Props> = ({
  addresses,
  setAddresses,
  handleAddressesCheck,
  detectedInvalidAddresses,
  setDetectedInvalidAddresses,
  loading,
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <Flex direction={"column"} gap={"8px"}>
        <Text size={"3"} weight={"bold"}>
          Enter addresses
        </Text>
        <Text>Enter addresses to check eligibility. One address per line.</Text>
      </Flex>

      <InputAddressesBoxContainer>
        <InputAddressesBox
          placeholder="Paste addresses here (ENS addresses are supported)"
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
        />

        <ClearAllBtnWrapper>
          {addresses.length > 0 && (
            <ClearAllButton
              onClick={() => {
                setAddresses("");
                setDetectedInvalidAddresses(false);
              }}
            >
              <CloseIcon>×</CloseIcon>
              <Text style={{ color: theme.color.blue2 }}>Clear all</Text>
            </ClearAllButton>
          )}
        </ClearAllBtnWrapper>

        <Flex height={"20px"}>
          {detectedInvalidAddresses && (
            <Text style={{ color: theme.color.red1 }}>
              One or more invalid addresses detected
            </Text>
          )}
        </Flex>
      </InputAddressesBoxContainer>

      <Flex pb={"80px"} pt={"20px"}>
        {loading ? (
          <GradientLoaderButton
            title={"Checking addresses ..."}
            width={isMobile ? "100%" : "200px"}
          />
        ) : (
          <GradientSolidButton
            title="Check addresses"
            width={isMobile ? "100%" : "200px"}
            isDisabled={addresses.length === 0}
            handleClick={() => {
              addresses && handleAddressesCheck();
            }}
          />
        )}
      </Flex>
    </>
  );
};

export default AddressCheckSection;
