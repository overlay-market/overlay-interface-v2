import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import theme from "../../../theme";
import {
  AirdropMap,
  AIRDROPS,
  AirdropStatus,
  MERKLE_DISTIBUTOR_ADDRESSES,
} from "../../../constants/airdrops";
import { AddressRowsType } from "../types";
import { isAddress } from "viem";
import { shortenAddress } from "../../../utils/web3";
import {
  CopiedBox,
  CopyIconWrapper,
  StyledCell,
  StyledHeader,
  StyledLink,
  StyledRow,
  Table,
  TotalAmountCell,
} from "./eligibility-section-styles";
import { CopyIcon, OpenInNewIcon } from "../../../assets/icons/svg-icons";
import AirdropIdWithTooltip from "./AirdropIdWithTooltip";

interface Props {
  airdrops: AirdropMap;
  addressAirdropRows: AddressRowsType | null;
  totalAmountValues: string[] | null;
}

const EligibilitySection: React.FC<Props> = ({
  airdrops,
  addressAirdropRows,
  totalAmountValues,
}) => {
  const [copiedStatus, setCopiedStatus] = useState<
    "Copied" | "Could not copy" | false
  >(false);
  const [copiedAddress, setCopiedAddress] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setCopiedStatus(false), 1000);
    return () => clearTimeout(timer);
  }, [copiedStatus, setCopiedStatus]);

  const copyToClipboardHandle = (text: string) => {
    setCopiedAddress(text);
    navigator.clipboard.writeText(text).then(
      () => setCopiedStatus("Copied"),
      () => setCopiedStatus("Could not copy")
    );
  };

  const displayAddress = (address: string) => {
    if (isAddress(address)) {
      return shortenAddress(address);
    } else {
      return address;
    }
  };

  return (
    <Flex direction={"column"} pb="100px">
      <Flex direction="column" gap="8px" pb="32px">
        <Text size={"3"} weight={"bold"}>
          Eligibility
        </Text>
        <Text style={{ color: theme.color.blue1 }}>
          View eligibility for each address here
        </Text>
      </Flex>

      <Table>
        <thead>
          <tr>
            <StyledHeader textalign={"left"}>Address</StyledHeader>
            {airdrops &&
              Object.keys(airdrops).map((airdropId: string) => {
                return (
                  <StyledHeader key={airdropId} textalign={"right"}>
                    <AirdropIdWithTooltip airdrop={airdrops[airdropId]} />
                  </StyledHeader>
                );
              })}
          </tr>
        </thead>

        <tbody>
          {addressAirdropRows &&
            Object.keys(addressAirdropRows).map((address) => (
              <StyledRow key={address}>
                <StyledCell textalign="left">
                  <Flex
                    gap="10px"
                    align={"center"}
                    style={{ cursor: "pointer" }}
                    onClick={() => copyToClipboardHandle(address)}
                  >
                    <Text>{displayAddress(address)}</Text>
                    <CopyIconWrapper>
                      <CopyIcon />

                      {copiedStatus && copiedAddress === address && (
                        <CopiedBox>{copiedStatus}</CopiedBox>
                      )}
                    </CopyIconWrapper>
                  </Flex>
                </StyledCell>
                {addressAirdropRows[address].map((value: string, ind) => {
                  return (
                    <StyledCell key={ind} textalign="right">
                      <Text>{value}</Text>
                    </StyledCell>
                  );
                })}
              </StyledRow>
            ))}

          {totalAmountValues &&
            addressAirdropRows &&
            Object.keys(addressAirdropRows).length !== 0 && (
              <StyledRow>
                <StyledCell
                  id="totalamount"
                  textalign="left"
                  style={{
                    width:
                      Object.keys(airdrops).length === 1 ? "160px" : "135px",
                  }}
                >
                  <TotalAmountCell>
                    <Text style={{ color: theme.color.grey3 }}>
                      Total amount
                    </Text>
                    {Object.keys(airdrops).length === 1 &&
                      (AIRDROPS[Object.keys(airdrops)[0]].status ===
                      AirdropStatus.COMING_SOON ? (
                        <Text style={{ color: theme.color.blue2 }}>
                          Coming soon
                        </Text>
                      ) : (
                        <StyledLink
                          to={`/claim/${
                            MERKLE_DISTIBUTOR_ADDRESSES[
                              Object.keys(airdrops)[0]
                            ]
                          }`}
                          onClick={(event) =>
                            AIRDROPS[Object.keys(airdrops)[0]].status ===
                              AirdropStatus.TBA && event.preventDefault()
                          }
                          target="_blank"
                          style={{
                            color:
                              AIRDROPS[Object.keys(airdrops)[0]].status ===
                              AirdropStatus.TBA
                                ? theme.color.grey8
                                : theme.color.blue2,
                            cursor:
                              AIRDROPS[Object.keys(airdrops)[0]].status ===
                              AirdropStatus.TBA
                                ? "default"
                                : "pointer",
                          }}
                        >
                          Claim
                          <OpenInNewIcon />
                        </StyledLink>
                      ))}
                  </TotalAmountCell>
                </StyledCell>
                {totalAmountValues.map((value: string | number, ind) => {
                  return (
                    <StyledCell key={ind} textalign="right">
                      <Text>{value}</Text>
                    </StyledCell>
                  );
                })}
              </StyledRow>
            )}

          {addressAirdropRows &&
            Object.keys(airdrops).length > 1 &&
            Object.keys(addressAirdropRows).length !== 0 && (
              <StyledRow>
                <StyledCell id="claim" textalign="left">
                  <Text style={{ color: theme.color.grey3 }}>Claim OV</Text>
                </StyledCell>
                {Object.keys(AIRDROPS).map((airdropId) => {
                  return (
                    <StyledCell key={airdropId} textalign="right">
                      {AIRDROPS[airdropId].status ===
                      AirdropStatus.COMING_SOON ? (
                        <Text style={{ color: theme.color.grey3 }}>
                          Coming soon
                        </Text>
                      ) : (
                        <StyledLink
                          to={`/claim/${MERKLE_DISTIBUTOR_ADDRESSES[airdropId]}`}
                          onClick={(event) =>
                            AIRDROPS[airdropId].status === AirdropStatus.TBA &&
                            event.preventDefault()
                          }
                          target="_blank"
                          style={{
                            color:
                              AIRDROPS[airdropId].status === AirdropStatus.TBA
                                ? theme.color.grey8
                                : theme.color.blue2,
                            cursor:
                              AIRDROPS[airdropId].status === AirdropStatus.TBA
                                ? "default"
                                : "pointer",
                          }}
                        >
                          Claim
                          <OpenInNewIcon />
                        </StyledLink>
                      )}
                    </StyledCell>
                  );
                })}
              </StyledRow>
            )}
        </tbody>
      </Table>

      {(!addressAirdropRows ||
        Object.keys(addressAirdropRows).length === 0) && (
        <Flex p={"16px"}>
          <Text style={{ color: theme.color.blue1 }}>No addresses yet</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default EligibilitySection;
