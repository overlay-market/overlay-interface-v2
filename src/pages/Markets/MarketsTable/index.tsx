import { Flex, Skeleton, Table, Text } from "@radix-ui/themes";
import { LineChart, Line, YAxis } from "recharts";
import theme from "../../../theme";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { TransformedMarketData } from "overlay-sdk";
import ProgressBar from "../../../components/ProgressBar";
import { useMarkets7d } from "../../../hooks/useMarkets7d";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";
import { Theme } from "@radix-ui/themes";
import { useState } from "react";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import {
  CategoriesBar,
  CategoryBarWrapper,
  CategoryButton,
  MarketsLogos,
  NewBadge,
  ScrollIndicator,
} from "./markets-table-styles";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import * as React from "react";
import { getMarketLogo } from "../../../utils/getMarketLogo";
import { isGamblingMarket } from "../../../utils/marketGuards";
import {
  CategoryName,
  MARKET_CATEGORIES,
  NEW_CATEGORIES,
} from "../../../constants/markets";

interface MarketsTableProps {
  marketsData: TransformedMarketData[];
  otherChainMarketsData?: TransformedMarketData[];
}

type SortableKeys =
  | "funding"
  | "oneHourChange"
  | "twentyFourHourChange"
  | "sevenDayChange";

export default function MarketsTable({
  marketsData,
  otherChainMarketsData = [],
}: MarketsTableProps): JSX.Element {
  const redirectToTradePage = useRedirectToTradePage();
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryName | "All"
  >("All");

  const isMobile = useMediaQuery("(max-width: 767px)");

  const { categoryIdsMap, categorizedIds } = React.useMemo(() => {
    const allIds = new Set<string>();
    const map = new Map<CategoryName, Set<string>>();

    (Object.entries(MARKET_CATEGORIES) as [CategoryName, string[]][]).forEach(
      ([category, marketIds]) => {
        const idsSet = new Set(marketIds);
        map.set(category, idsSet);
        marketIds.forEach((marketId) => allIds.add(marketId));
      }
    );

    return { categoryIdsMap: map, categorizedIds: allIds };
  }, []);

  const isLoadingMarkets =
    marketsData.length === 0 && otherChainMarketsData.length === 0;

  const categoryOptions = React.useMemo<(CategoryName | "All")[]>(() => {
    if (isLoadingMarkets) return [];

    const allMarketsId = new Set(marketsData.map((m) => m.marketId));

    const liveCategories = (Object.keys(MARKET_CATEGORIES) as CategoryName[]).filter(
      (category) => {
        if (category === CategoryName.Other) {
          return (
            marketsData.some((m) => !categorizedIds.has(m.marketId)) ||
            otherChainMarketsData.some((m) => !categorizedIds.has(m.marketId))
          );
        }
        const idsInCategory = MARKET_CATEGORIES[category];
        return idsInCategory.some((id) => allMarketsId.has(id));
      }
    );

    return ["All", ...liveCategories];
  }, [isLoadingMarkets, marketsData, otherChainMarketsData, categorizedIds]);

  const filteredMarketsData = React.useMemo(() => {
    if (selectedCategory === "All") return marketsData;
    if (selectedCategory === CategoryName.Other) {
      return marketsData.filter(
        (market) => !categorizedIds.has(market.marketId)
      );
    }
    const categorySet = categoryIdsMap.get(selectedCategory);
    if (!categorySet || categorySet.size === 0) return marketsData;
    return marketsData.filter((market) => categorySet.has(market.marketId));
  }, [categorizedIds, categoryIdsMap, marketsData, selectedCategory]);

  const filteredOtherChainMarketsData = React.useMemo(() => {
    if (selectedCategory === "All") return otherChainMarketsData;
    if (selectedCategory === CategoryName.Other) {
      return otherChainMarketsData.filter(
        (market) => !categorizedIds.has(market.marketId)
      );
    }
    const categorySet = categoryIdsMap.get(selectedCategory);
    if (!categorySet || categorySet.size === 0) return otherChainMarketsData;
    return otherChainMarketsData.filter((market) =>
      categorySet.has(market.marketId)
    );
  }, [
    categorizedIds,
    categoryIdsMap,
    otherChainMarketsData,
    selectedCategory,
  ]);

  const defaultMarketIds = new Set(
    filteredMarketsData.map((market) => market.marketId)
  );
  const uniqueOtherChainMarkets = filteredOtherChainMarketsData.filter(
    (market) => !defaultMarketIds.has(market.marketId)
  );
  const allMarketsData = [...filteredMarketsData, ...uniqueOtherChainMarkets];

  const marketIds = allMarketsData.map((market) => market.marketId);
  const markets7d = useMarkets7d(marketIds);

  const sortedData = React.useMemo(() => {
    const sortableItems = [...filteredMarketsData];
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
    return [...sortableItems, ...uniqueOtherChainMarkets];
  }, [filteredMarketsData, markets7d, sortConfig, uniqueOtherChainMarkets]);

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

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollLeft(scrollLeft > 5);
      setShowScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      // Also check on a small delay to ensure rendering is complete
      const timeoutId = setTimeout(checkScroll, 100);

      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [checkScroll, categoryOptions]);

  return (
    <Theme>
      <CategoryBarWrapper mt="5" mb="3">
        <ScrollIndicator
          $visible={showScrollLeft}
          $side="left"
          type="button"
          aria-label="Scroll categories left"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
            }
          }}
        >
          <ChevronDownIcon style={{ transform: "rotate(90deg)" }} />
        </ScrollIndicator>
        <CategoriesBar ref={scrollRef}>
          {isLoadingMarkets
            ? Array.from({ length: 8 }).map((_, i) => (
              <CategoryButton key={i} type="button" $active={false} style={{ pointerEvents: 'none' }}>
                <Skeleton width="60px" height="20px" />
              </CategoryButton>
            ))
            : categoryOptions.map((category) => {
              const isNew = NEW_CATEGORIES.includes(category as CategoryName);

              return (
                <CategoryButton
                  key={category}
                  type="button"
                  $active={selectedCategory === category}
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "All" ? "All" : category}
                  {isNew && <NewBadge>New</NewBadge>}
                </CategoryButton>
              );
            })}
        </CategoriesBar>
        <ScrollIndicator
          $visible={showScrollRight}
          $side="right"
          type="button"
          aria-label="Scroll categories right"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
            }
          }}
        >
          <ChevronDownIcon style={{ transform: "rotate(-90deg)" }} />
        </ScrollIndicator>
      </CategoryBarWrapper>
      <Table.Root
        variant="surface"
        ml={{ xs: "16px" }}
        style={{
          background: `${theme.color.background}`,
          border: "none",
          marginTop: 0,
          marginBottom: `${isMobile ? "90px" : "30px"}`,
        }}
      >
        <Table.Header style={{ verticalAlign: "middle" }}>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="2">
                Market
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

              const isComingSoon = !defaultMarketIds.has(market.marketId);
              const marketName =
                market.marketName ?? decodeURIComponent(market.marketId);
              const isGambling = isGamblingMarket(marketName);

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
                    cursor: isComingSoon ? "default" : "pointer",
                    opacity: isComingSoon ? 0.8 : 1,
                  }}
                  onClick={() =>
                    !isComingSoon && redirectToTradePage(market.marketId)
                  }
                >
                  <Table.Cell
                    style={{ padding: isMobile ? "8px 0px" : "8px 16px" }}
                  >
                    <Flex style={{ alignItems: "center" }}>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <MarketsLogos
                          src={getMarketLogo(market.marketId)}
                          alt={decodeURIComponent(market.marketId)}
                          className="rounded-full"
                          style={{
                            filter: isComingSoon
                              ? "grayscale(100%) brightness(0.6)"
                              : "none",
                          }}
                        />
                        {isComingSoon && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "8px",
                              fontWeight: "bold",
                              textAlign: "center",
                              borderRadius: "50%",
                            }}
                          >
                            SOON
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          alignSelf: "center",
                          marginLeft: 20,
                          color: isComingSoon ? "#8B8B8B" : "inherit",
                        }}
                      >
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
                  <Table.Cell
                    style={{
                      color: isComingSoon || isGambling ? "#8B8B8B" : "inherit",
                    }}
                  >
                    {!isGambling
                      ? formatPriceWithCurrency(
                        market.price ?? 0,
                        market.priceCurrency
                      )
                      : "-"}
                  </Table.Cell>
                  {!isMobile && (
                    <>
                      <Table.Cell
                        style={{
                          color: isComingSoon || isGambling
                            ? "#8B8B8B"
                            : (market7d?.oneHourChange ?? 0) >= 0
                              ? theme.color.green2
                              : theme.color.red2,
                        }}
                      >
                        {isGambling ? (
                          "-"
                        ) : (
                          <Skeleton loading={!market7d}>
                            {market7d?.oneHourChange?.toFixed(2)}%
                          </Skeleton>
                        )}
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color: isComingSoon || isGambling
                            ? "#8B8B8B"
                            : (market7d?.twentyFourHourChange ?? 0) >= 0
                              ? theme.color.green2
                              : theme.color.red2,
                        }}
                      >
                        {isGambling ? (
                          "-"
                        ) : (
                          <Skeleton loading={!market7d}>
                            {market7d?.twentyFourHourChange?.toFixed(2)}%
                          </Skeleton>
                        )}
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color: isComingSoon || isGambling
                            ? "#8B8B8B"
                            : (market7d?.sevenDayChange ?? 0) >= 0
                              ? theme.color.green2
                              : theme.color.red2,
                        }}
                      >
                        {isGambling ? (
                          "-"
                        ) : (
                          <Skeleton loading={!market7d}>
                            {market7d?.sevenDayChange?.toFixed(2)}%
                          </Skeleton>
                        )}
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color:
                            isComingSoon || isGambling
                              ? "#8B8B8B"
                              : theme.color.green2,
                        }}
                      >
                        {isGambling ? (
                          "-"
                        ) : (
                          <span
                            style={{
                              color: isComingSoon
                                ? "#8B8B8B"
                                : market.funding && Number(market.funding) < 0
                                  ? theme.color.red2
                                  : theme.color.green2,
                            }}
                          >
                            {market.funding && Number(market.funding) < 0
                              ? market.funding
                              : `+${market.funding}`}
                            %
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {isComingSoon ? (
                          <Text
                            size="4"
                            style={{
                              background:
                                "linear-gradient(90deg, #A8A6A6 0%, #ff7cd5 100%)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontWeight: "bold",
                            }}
                          >
                            Coming Soon
                          </Text>
                        ) : isGambling ? (
                          <Text size="2" style={{ color: "#8B8B8B" }}>
                            -
                          </Text>
                        ) : (
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
                            <Text
                              size="2"
                              style={{ color: theme.color.green2 }}
                            >
                              {Math.round(
                                Number(market.longPercentageOfTotalOi)
                              )}
                              %
                            </Text>
                          </Flex>
                        )}
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
                  <Table.Cell
                    style={{
                      color: isComingSoon || isGambling ? "#8B8B8B" : "inherit",
                    }}
                  >
                    {isGambling ? (
                      "-"
                    ) : (
                      <Skeleton loading={!market7d}>
                        <LineChart
                          width={isMobile ? 80 : 100}
                          height={30}
                          data={market7d?.sevenDaysChartData?.map(
                            (value) => ({
                              value,
                            })
                          )}
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
                            stroke={isComingSoon ? "#8B8B8B" : lineColor}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </Skeleton>
                    )}
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
