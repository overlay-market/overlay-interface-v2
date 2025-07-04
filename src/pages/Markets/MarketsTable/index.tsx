import { Box, Flex, Skeleton, Table, Text } from "@radix-ui/themes";
import { LineChart, Line, YAxis } from "recharts";
import theme from "../../../theme";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { TransformedMarketData } from "overlay-sdk";
import ProgressBar from "../../../components/ProgressBar";
import { useMarkets7d } from "../../../hooks/useMarkets7d";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";
import { Theme } from "@radix-ui/themes";
import { useState } from "react";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import { MarketsLogos } from "./markets-table-styles";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import * as React from "react";
import { getMarketLogo } from "../../../utils/getMarketLogo";

interface MarketsTableProps {
  marketsData: TransformedMarketData[];
}

type SortableKeys =
  | "funding"
  | "oneHourChange"
  | "twentyFourHourChange"
  | "sevenDayChange";

export default function MarketsTable({
  marketsData,
}: MarketsTableProps): JSX.Element {
  const marketIds = marketsData.map((market) => market.marketId);
  const markets7d = useMarkets7d(marketIds);
  const redirectToTradePage = useRedirectToTradePage();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  } | null>(null);

  const isMobile = useMediaQuery("(max-width: 767px)");

  const sortedData = React.useMemo(() => {
    const sortableItems = [...marketsData];
    if (sortConfig?.key) {
      sortableItems.sort((a, b) => {
        let aValue = 0,
          bValue = 0;
        const aMarket7d = markets7d.find((m) => m.marketId === a.marketId);
        const bMarket7d = markets7d.find((m) => m.marketId === b.marketId);

        switch (sortConfig.key) {
          case "funding":
            aValue = parseFloat(String(a.funding ?? "0"));
            bValue = parseFloat(String(b.funding ?? "0"));
            break;
          case "oneHourChange":
            aValue = parseFloat(aMarket7d?.oneHourChange?.toString() ?? "0");
            bValue = parseFloat(bMarket7d?.oneHourChange?.toString() ?? "0");
            break;
          case "twentyFourHourChange":
            aValue = parseFloat(
              aMarket7d?.twentyFourHourChange?.toString() ?? "0"
            );
            bValue = parseFloat(
              bMarket7d?.twentyFourHourChange?.toString() ?? "0"
            );
            break;
          case "sevenDayChange":
            aValue = parseFloat(aMarket7d?.sevenDayChange?.toString() ?? "0");
            bValue = parseFloat(bMarket7d?.sevenDayChange?.toString() ?? "0");
            break;
        }

        return aValue < bValue
          ? sortConfig.direction === "ascending"
            ? 1
            : -1
          : aValue > bValue
          ? sortConfig.direction === "ascending"
            ? -1
            : 1
          : 0;
      });
    }
    return sortableItems;
  }, [marketsData, markets7d, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending";

    if (sortConfig?.key === key) {
      direction =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
    } else {
      direction = "ascending";
    }

    setSortConfig({ key, direction });
  };

  return (
    <Theme>
      <Table.Root
        variant="surface"
        ml={{ xs: "16px" }}
        style={{
          background: `${theme.color.background}`,
          border: "none",
          marginTop: 24,
          marginBottom: `${isMobile ? "90px" : "30px"}`,
        }}
      >
        <Table.Header style={{ verticalAlign: "middle" }}>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="2">
                <Text style={{ color: theme.color.grey3 }}>ALL</Text>
                <Box display={"none"}>
                  <Select.Root
                    onValueChange={(value) => setSelectedItem(value)}
                  >
                    <Select.Trigger
                      style={{
                        backgroundColor: theme.color.grey4,
                        borderRadius: 16,
                        padding: "4px 15px",
                        minHeight: 35,
                        boxShadow: "0 2px 10px var(--black-a7)",
                        border: "none",
                        color: theme.color.white,
                        marginLeft: 10,
                        minWidth: 95,
                        outline: "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <Select.Value placeholder="Filter" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        sideOffset={5}
                        style={{
                          width: "var(--radix-select-trigger-width)",
                          maxHeight:
                            "var(--radix-select-content-available-height)",
                          backgroundColor: theme.color.grey4,
                          borderRadius: "6px",
                          padding: "5px",
                          boxShadow:
                            "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",

                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <Select.Viewport>
                          <Select.Group>
                            {["All", "Crypto", "Forex", "Stocks"].map(
                              (item) => (
                                <Select.Item
                                  key={item}
                                  value={item.toLowerCase()}
                                  onMouseEnter={() => setHoveredItem(item)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                  style={{
                                    fontSize: 13,
                                    lineHeight: "1",
                                    color: theme.color.white,
                                    borderRadius: "3px",
                                    display: "flex",
                                    alignItems: "center",
                                    height: "25px",
                                    padding: "0 35px 0 10px",
                                    position: "relative",
                                    userSelect: "none",
                                    backgroundColor:
                                      selectedItem === item.toLowerCase()
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : hoveredItem === item
                                        ? "rgba(255, 255, 255, 0.1)"
                                        : "transparent",
                                    cursor: "pointer",
                                    outline: "none",
                                  }}
                                >
                                  <Select.ItemText>{item}</Select.ItemText>
                                </Select.Item>
                              )
                            )}
                          </Select.Group>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </Box>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            {!isMobile && (
              <Table.ColumnHeaderCell
                onClick={() => requestSort("oneHourChange")}
                style={{
                  cursor: "pointer",
                  minWidth: "100px",
                  width: "100px",
                }}
              >
                <Flex
                  align="center"
                  justify="start"
                  gap="1"
                  style={{ width: "100%" }}
                >
                  <span>1h</span>
                  {sortConfig?.key === "oneHourChange" && (
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  )}
                </Flex>
              </Table.ColumnHeaderCell>
            )}
            {!isMobile && (
              <Table.ColumnHeaderCell
                onClick={() => requestSort("twentyFourHourChange")}
                style={{
                  cursor: "pointer",
                  minWidth: "100px",
                  width: "100px",
                }}
              >
                <Flex
                  align="center"
                  justify="start"
                  gap="1"
                  style={{ width: "100%" }}
                >
                  <span>24h</span>
                  {sortConfig?.key === "twentyFourHourChange" && (
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  )}
                </Flex>
              </Table.ColumnHeaderCell>
            )}
            {!isMobile && (
              <Table.ColumnHeaderCell
                onClick={() => requestSort("sevenDayChange")}
                style={{
                  cursor: "pointer",
                  minWidth: "100px",
                  width: "100px",
                }}
              >
                <Flex
                  align="center"
                  justify="start"
                  gap="1"
                  style={{ width: "100%" }}
                >
                  <span>7d</span>
                  {sortConfig?.key === "sevenDayChange" && (
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  )}
                </Flex>
              </Table.ColumnHeaderCell>
            )}
            {!isMobile && (
              <Table.ColumnHeaderCell
                onClick={() => requestSort("funding")}
                style={{
                  cursor: "pointer",
                  minWidth: "100px",
                  width: "100px",
                }}
              >
                <Flex
                  align="center"
                  justify="start"
                  gap="1"
                  style={{ width: "100%" }}
                >
                  <span>Funding</span>
                  <span>24h</span>
                  {sortConfig?.key === "funding" && (
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  )}
                </Flex>
              </Table.ColumnHeaderCell>
            )}
            {!isMobile && (
              <Table.ColumnHeaderCell>OI Balance</Table.ColumnHeaderCell>
            )}
            {!isMobile && (
              <Table.ColumnHeaderCell style={{ textAlign: "center" }}>
                Oracle
              </Table.ColumnHeaderCell>
            )}
            <Table.ColumnHeaderCell>Last 7 Days</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ verticalAlign: "middle" }}>
          {sortedData.length > 0 ? (
            sortedData.map((market, index) => {
              const market7d = markets7d.find(
                (m) => m.marketId === market.marketId
              );

              const lineColor =
                market7d &&
                market7d.sevenDaysChartData &&
                market7d.sevenDaysChartData.length > 0
                  ? market7d.sevenDaysChartData[
                      market7d.sevenDaysChartData.length - 1
                    ] > market7d.sevenDaysChartData[0]
                    ? theme.color.green2
                    : theme.color.red2
                  : theme.color.grey3;

              return (
                <Table.Row
                  key={index}
                  style={{
                    borderBottom: `1px solid ${theme.color.darkBlue}`,
                    cursor: "pointer",
                  }}
                  onClick={() => redirectToTradePage(market.marketId)}
                >
                  <Table.Cell
                    style={{ padding: isMobile ? "8px 0px" : "8px 16px" }}
                  >
                    <Flex style={{ alignItems: "center" }}>
                      <MarketsLogos
                        src={getMarketLogo(market.marketId)}
                        alt={decodeURIComponent(market.marketId)}
                        className="rounded-full"
                      />
                      <span style={{ alignSelf: "center", marginLeft: 20 }}>
                        {isMobile &&
                        decodeURIComponent(market.marketId).length > 28
                          ? `${decodeURIComponent(market.marketId).slice(
                              0,
                              28
                            )}...`
                          : decodeURIComponent(market.marketId)}
                      </span>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    {formatPriceWithCurrency(
                      market.price ?? 0,
                      market.priceCurrency
                    )}
                  </Table.Cell>
                  {!isMobile && (
                    <>
                      <Table.Cell
                        style={{
                          color:
                            (market7d?.oneHourChange ?? 0) >= 0
                              ? theme.color.green2
                              : theme.color.red2,
                        }}
                      >
                        <Skeleton loading={!market7d}>
                          {market7d?.oneHourChange?.toFixed(2)}%
                        </Skeleton>
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color:
                            (market7d?.twentyFourHourChange ?? 0) >= 0
                              ? theme.color.green2
                              : theme.color.red2,
                        }}
                      >
                        <Skeleton loading={!market7d}>
                          {market7d?.twentyFourHourChange?.toFixed(2)}%
                        </Skeleton>
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color:
                            (market7d?.sevenDayChange ?? 0) >= 0
                              ? theme.color.green2
                              : theme.color.red2,
                        }}
                      >
                        <Skeleton loading={!market7d}>
                          {market7d?.sevenDayChange?.toFixed(2)}%
                        </Skeleton>
                      </Table.Cell>
                      <Table.Cell style={{ color: theme.color.green2 }}>
                        <span
                          style={{
                            color:
                              market.funding && Number(market.funding) < 0
                                ? theme.color.red2
                                : theme.color.green2,
                          }}
                        >
                          {market.funding && Number(market.funding) < 0
                            ? market.funding
                            : `+${market.funding}`}
                          %
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          <Text size="2" style={{ color: theme.color.red2 }}>
                            {Math.round(
                              Number(market.shortPercentageOfTotalOi)
                            )}
                            %
                          </Text>
                          <ProgressBar
                            max={100}
                            value={Number(market.shortPercentageOfTotalOi)}
                          />
                          <Text size="2" style={{ color: theme.color.green2 }}>
                            {Math.round(Number(market.longPercentageOfTotalOi))}
                            %
                          </Text>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell style={{ textAlign: "center" }}>
                        <img
                          src={market.oracleLogo}
                          alt={decodeURIComponent(market.marketId)}
                          style={{
                            maxWidth: 24,
                            maxHeight: 24,
                          }}
                        />
                      </Table.Cell>
                    </>
                  )}
                  <Table.Cell>
                    <Skeleton loading={!market7d}>
                      <LineChart
                        width={isMobile ? 80 : 100}
                        height={30}
                        data={market7d?.sevenDaysChartData?.map((value) => ({
                          value,
                        }))}
                        margin={{ top: 0, bottom: 0 }}
                      >
                        <YAxis
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          hide
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={lineColor}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </Skeleton>
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <>
              {Array.from({ length: 3 }).map(() => (
                <Table.Row
                  style={{
                    borderBottom: `1px solid ${theme.color.darkBlue}`,
                    width: "100%",
                  }}
                >
                  {Array.from({ length: isMobile ? 3 : 9 }).map(() => (
                    <Table.Cell>
                      <Skeleton width={"100%"} height={"42px"} />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </>
          )}
        </Table.Body>
      </Table.Root>
    </Theme>
  );
}
