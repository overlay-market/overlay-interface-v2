import { Flex, ScrollArea, Text } from "@radix-ui/themes";
import {
  RotatingTriangle,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TriangleButton,
} from "./rebates-table-styles";
import { useEffect, useMemo, useState } from "react";
import useAccount from "../../hooks/useAccount";
import theme from "../../theme";
import formatUnixTimestampToDate from "../../utils/formatUnixTimestampToDate";
import { useTokenTransfersReferralData } from "../../hooks/referrals/useTokenTransfersReferralData";
import { REFERRAL_LIST_ADDRESS, UNIT } from "../../constants/applications";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { OVL_TOKEN_ADDRESS } from "../../constants/bridge";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Loader from "../../components/Loader";
import { ExternalLink } from "react-feather";
import { formatAmount } from "../../utils/formatAmount";

const referralColumns = ["Date", "Amount", "Bscscan"];

export const RebatesTable = () => {
  const { address: account, chainId } = useAccount();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const referralListAddress = chainId
    ? REFERRAL_LIST_ADDRESS[chainId]
    : REFERRAL_LIST_ADDRESS[DEFAULT_CHAINID as number];

  const { tokenTransfersData, isLoading, refetch, isUninitialized } =
    useTokenTransfersReferralData(
      account,
      referralListAddress,
      OVL_TOKEN_ADDRESS
    );

  useEffect(() => {
    if (!isUninitialized) refetch();
  }, [chainId, account, isLoading, isUninitialized, refetch]);

  const sortedValues = useMemo(() => {
    return tokenTransfersData?.tokenTransfers?.map((transfer) =>
      referralColumns.map((column) => {
        switch (column) {
          case "Date":
            return transfer?.transaction?.timestamp
              ? formatUnixTimestampToDate(
                  transfer.transaction.timestamp,
                  isMobile
                )
              : null;
          case "Amount":
            return `${formatAmount(transfer?.amount)} ${UNIT}`;
          case "Bscscan":
            return (
              <a
                href={`https://bscscan.com/tx/${transfer?.transaction?.id}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: theme.color.blue2, cursor: "pointer" }}
              >
                <Flex gap={"4px"} align="center" justify={"end"}>
                  Transaction
                  <ExternalLink width={13} height={13} />
                </Flex>
              </a>
            );
          default:
            return "";
        }
      })
    );
  }, [tokenTransfersData]);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Flex
      direction={"column"}
      mt={"80px"}
      style={{ maxWidth: "100%", padding: 0 }}
    >
      <Flex align={"baseline"}>
        <Text size={"3"} weight={"bold"}>
          Rebate Distribution
        </Text>
        <TriangleButton onClick={handleToggle}>
          <RotatingTriangle
            color="white"
            fill="white"
            height={10}
            width={10}
            open={open}
          />
        </TriangleButton>
      </Flex>

      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Content>
          <div>
            <ScrollArea type="auto" scrollbars="horizontal" size="2">
              <Table>
                <thead>
                  <TableRow>
                    {referralColumns.map((col, i) => (
                      <TableHeader
                        key={col}
                        width={10}
                        style={{ textAlign: i === 0 ? "left" : "right" }}
                      >
                        <Text>{col}</Text>
                      </TableHeader>
                    ))}
                  </TableRow>
                </thead>
                <tbody>
                  {sortedValues &&
                    sortedValues.length > 0 &&
                    sortedValues.map((row, idx) => (
                      <TableRow key={idx}>
                        {row.map((cell, i) => (
                          <TableCell
                            key={i}
                            style={{ textAlign: i === 0 ? "left" : "right" }}
                          >
                            <Text>{cell}</Text>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </tbody>
              </Table>
            </ScrollArea>

            <Flex
              style={{
                color: theme.color.blue1,
              }}
              m={"16px"}
            >
              {isLoading && !sortedValues ? (
                <Loader />
              ) : (
                sortedValues &&
                sortedValues.length === 0 && (
                  <Text>No rebate distribution yet</Text>
                )
              )}
            </Flex>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </Flex>
  );
};
