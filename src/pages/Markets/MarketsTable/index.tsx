import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { TransformedMarketData } from "overlay-sdk";
import * as React from "react";
import { useEffect, useState } from "react";
import { Line, LineChart, YAxis } from "recharts";
import ProgressBar from "../../../components/ProgressBar";
import {
  CategoryName,
  getMarketClass,
  MARKET_CATEGORIES,
  MARKETS_PAGE_CATEGORY_ORDER,
  MarketClass,
  NEW_CATEGORIES,
} from "../../../constants/markets";
import { useMarkets7d } from "../../../hooks/useMarkets7d";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";
import theme from "../../../theme";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import { getMarketLogo } from "../../../utils/getMarketLogo";
import { getMarketGroup, isGamblingMarket } from "../../../utils/marketGuards";
import {
  BodyRow,
  CategoriesBar,
  CategoryBarWrapper,
  CategoryButton,
  Cell,
  DirectoryEyebrow,
  DirectoryHeader,
  DirectoryMeta,
  DirectoryPanel,
  DirectoryTitle,
  DirectoryTitleGroup,
  EmptyState,
  HeaderButton,
  HeaderCell,
  LogoStack,
  MarketBadge,
  MarketIdentity,
  MarketLogo,
  MarketName,
  MarketsTableElement,
  MarketSubline,
  MarketText,
  MutedDash,
  NewBadge,
  NumericCellValue,
  OiBalance,
  OiPercentages,
  RotatingLogoWrap,
  ScrollIndicator,
  SearchField,
  SearchInput,
  SkeletonBlock,
  SparklineWrap,
  TableHead,
  TableScroll,
} from "./markets-table-styles";

interface MarketsTableProps {
  marketsData: TransformedMarketData[];
  otherChainMarketsData?: TransformedMarketData[];
}

type SortableKeys =
  | "funding"
  | "oneHourChange"
  | "twentyFourHourChange"
  | "sevenDayChange";

type SortDirection = "ascending" | "descending";
type Tone = "positive" | "negative" | "muted";

const decodeMarketId = (marketId: string) => {
  try {
    return decodeURIComponent(marketId);
  } catch {
    return marketId;
  }
};

const normalizeSearch = (value: string) => value.toLowerCase().trim();

const toNumber = (value: string | number | undefined) => {
  const numeric = Number(String(value ?? "").replaceAll(",", ""));
  return Number.isFinite(numeric) ? numeric : undefined;
};

const getTone = (value: number | undefined): Tone => {
  if (value === undefined || value === 0) return "muted";
  return value > 0 ? "positive" : "negative";
};

const formatSignedPercent = (value: number | undefined) => {
  if (value === undefined || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const formatFunding = (funding: string | number | undefined) => {
  const value = toNumber(funding);
  if (value === undefined) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(3)}%`;
};

const formatMarketPrice = (market: TransformedMarketData) => {
  const marketName = market.marketName ?? decodeMarketId(market.marketId);
  if (isGamblingMarket(marketName)) return "-";
  if (market.price === undefined || market.price === null) return "-";
  return formatPriceWithCurrency(market.price, market.priceCurrency);
};

const renderSortIcon = (
  sortConfig: { key: SortableKeys; direction: SortDirection } | null,
  key: SortableKeys
) => {
  if (sortConfig?.key !== key) {
    return <ChevronDownIcon aria-hidden="true" opacity={0.35} />;
  }

  return sortConfig.direction === "ascending" ? (
    <ChevronUpIcon aria-hidden="true" />
  ) : (
    <ChevronDownIcon aria-hidden="true" />
  );
};

const RotatingLogo: React.FC<{
  ids: string[];
  labels: Record<string, string>;
}> = ({ ids, labels }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ids.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [ids.length]);

  return (
    <RotatingLogoWrap>
      {ids.map((id, index) => (
        <MarketLogo
          key={id}
          src={getMarketLogo(id)}
          alt={labels[id] ?? decodeMarketId(id)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: index === activeIndex ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      ))}
    </RotatingLogoWrap>
  );
};

export default function MarketsTable({
  marketsData,
  otherChainMarketsData = [],
}: MarketsTableProps): JSX.Element {
  const redirectToTradePage = useRedirectToTradePage();
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: SortDirection;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryName | "All"
  >("All");
  const [query, setQuery] = useState("");

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

  const isLoadingMarkets = marketsData.length === 0;

  const categoryOptions = React.useMemo<(CategoryName | "All")[]>(() => {
    if (isLoadingMarkets) return [];

    const allMarketIds = new Set(marketsData.map((market) => market.marketId));
    const orderedCategories = [
      ...MARKETS_PAGE_CATEGORY_ORDER,
      ...(Object.keys(MARKET_CATEGORIES) as CategoryName[]).filter(
        (category) => !MARKETS_PAGE_CATEGORY_ORDER.includes(category)
      ),
    ];

    const liveCategories = orderedCategories.filter((category) => {
      if (category === CategoryName.Other) {
        return marketsData.some((market) => !categorizedIds.has(market.marketId));
      }

      const idsInCategory = MARKET_CATEGORIES[category];
      return idsInCategory.some((id) => allMarketIds.has(id));
    });

    return ["All", ...liveCategories];
  }, [categorizedIds, isLoadingMarkets, marketsData]);

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

  const defaultMarketIds = React.useMemo(
    () => new Set(filteredMarketsData.map((market) => market.marketId)),
    [filteredMarketsData]
  );

  const uniqueOtherChainMarkets = React.useMemo(
    () =>
      filteredOtherChainMarketsData.filter(
        (market) => !defaultMarketIds.has(market.marketId)
      ),
    [defaultMarketIds, filteredOtherChainMarketsData]
  );

  const allMarketsData = React.useMemo(
    () => [...filteredMarketsData, ...uniqueOtherChainMarkets],
    [filteredMarketsData, uniqueOtherChainMarkets]
  );

  const marketIds = React.useMemo(
    () => filteredMarketsData.map((market) => market.marketId),
    [filteredMarketsData]
  );
  const markets7d = useMarkets7d(marketIds);

  const sortedData = React.useMemo(() => {
    const sortableItems = [...filteredMarketsData];

    if (sortConfig?.key) {
      sortableItems.sort((a, b) => {
        let aValue = 0;
        let bValue = 0;
        const aMarket7d = markets7d.find((market) => market.marketId === a.marketId);
        const bMarket7d = markets7d.find((market) => market.marketId === b.marketId);

        switch (sortConfig.key) {
          case "funding":
            aValue = toNumber(a.funding) ?? 0;
            bValue = toNumber(b.funding) ?? 0;
            break;
          case "oneHourChange":
            aValue = aMarket7d?.oneHourChange ?? 0;
            bValue = bMarket7d?.oneHourChange ?? 0;
            break;
          case "twentyFourHourChange":
            aValue = aMarket7d?.twentyFourHourChange ?? 0;
            bValue = bMarket7d?.twentyFourHourChange ?? 0;
            break;
          case "sevenDayChange":
            aValue = aMarket7d?.sevenDayChange ?? 0;
            bValue = bMarket7d?.sevenDayChange ?? 0;
            break;
        }

        if (aValue === bValue) return 0;
        const directionMultiplier =
          sortConfig.direction === "ascending" ? -1 : 1;
        return aValue > bValue ? directionMultiplier : -directionMultiplier;
      });
    }

    return [...sortableItems, ...uniqueOtherChainMarkets];
  }, [filteredMarketsData, markets7d, sortConfig, uniqueOtherChainMarkets]);

  const searchedData = React.useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) return sortedData;

    return sortedData.filter((market) => {
      const marketName = market.marketName ?? decodeMarketId(market.marketId);
      const group = getMarketGroup(marketName);
      const groupSearch = group
        ? [
            group.title,
            group.groupId,
            ...group.marketIds.map(decodeMarketId),
            ...Object.values(group.outcomeLabels),
          ].join(" ")
        : "";

      return normalizeSearch(`${marketName} ${market.marketId} ${groupSearch}`).includes(
        normalizedQuery
      );
    });
  }, [query, sortedData]);

  const requestSort = (key: SortableKeys) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        return {
          key,
          direction:
            currentSort.direction === "ascending" ? "descending" : "ascending",
        };
      }

      return { key, direction: "ascending" };
    });
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
    if (!el) return undefined;

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    const timeoutId = setTimeout(checkScroll, 100);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeoutId);
    };
  }, [checkScroll, categoryOptions]);

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    callback: () => void,
    disabled?: boolean
  ) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const renderedGroupIds = new Set<string>();

  return (
    <DirectoryPanel>
      <DirectoryHeader>
        <DirectoryTitleGroup>
          <DirectoryEyebrow>Market Directory</DirectoryEyebrow>
          <DirectoryTitle>All Markets</DirectoryTitle>
          <DirectoryMeta>
            {isLoadingMarkets
              ? "Loading market terminal"
              : `${searchedData.length} visible / ${allMarketsData.length} listed`}
          </DirectoryMeta>
        </DirectoryTitleGroup>
        <SearchField>
          <MagnifyingGlassIcon aria-hidden="true" />
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search markets"
            aria-label="Search markets"
          />
        </SearchField>
      </DirectoryHeader>

      <CategoryBarWrapper>
        <ScrollIndicator
          $visible={showScrollLeft}
          $side="left"
          type="button"
          aria-label="Scroll categories left"
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -180, behavior: "smooth" });
          }}
        >
          <ChevronDownIcon style={{ transform: "rotate(90deg)" }} />
        </ScrollIndicator>
        <CategoriesBar ref={scrollRef}>
          {isLoadingMarkets
            ? Array.from({ length: 8 }).map((_, index) => (
                <CategoryButton
                  key={index}
                  type="button"
                  $active={false}
                  disabled
                >
                  <SkeletonBlock $width="54px" />
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
                    {category}
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
            scrollRef.current?.scrollBy({ left: 180, behavior: "smooth" });
          }}
        >
          <ChevronDownIcon style={{ transform: "rotate(-90deg)" }} />
        </ScrollIndicator>
      </CategoryBarWrapper>

      {searchedData.length > 0 ? (
        <TableScroll>
          <MarketsTableElement>
            <TableHead>
              <tr>
                <HeaderCell>Market</HeaderCell>
                <HeaderCell $align="right">Price</HeaderCell>
                {!isMobile && (
                  <HeaderCell $align="right">
                    <HeaderButton
                      type="button"
                      onClick={() => requestSort("oneHourChange")}
                    >
                      1h {renderSortIcon(sortConfig, "oneHourChange")}
                    </HeaderButton>
                  </HeaderCell>
                )}
                {!isMobile && (
                  <HeaderCell $align="right">
                    <HeaderButton
                      type="button"
                      onClick={() => requestSort("twentyFourHourChange")}
                    >
                      24h {renderSortIcon(sortConfig, "twentyFourHourChange")}
                    </HeaderButton>
                  </HeaderCell>
                )}
                <HeaderCell $align="right">
                  <HeaderButton
                    type="button"
                    onClick={() => requestSort("sevenDayChange")}
                  >
                    7d {renderSortIcon(sortConfig, "sevenDayChange")}
                  </HeaderButton>
                </HeaderCell>
                {!isMobile && (
                  <HeaderCell $align="right">
                    <HeaderButton
                      type="button"
                      onClick={() => requestSort("funding")}
                    >
                      Funding / 24h {renderSortIcon(sortConfig, "funding")}
                    </HeaderButton>
                  </HeaderCell>
                )}
                {!isMobile && <HeaderCell $align="right">OI Balance</HeaderCell>}
                {!isMobile && <HeaderCell $align="center">Oracle</HeaderCell>}
                {!isMobile && <HeaderCell $align="right">Last 7 Days</HeaderCell>}
              </tr>
            </TableHead>
            <tbody>
              {searchedData.map((market) => {
                const marketName = market.marketName ?? decodeMarketId(market.marketId);
                const group = getMarketGroup(marketName);

                if (group) {
                  if (renderedGroupIds.has(group.groupId)) return null;
                  renderedGroupIds.add(group.groupId);

                  const groupMarkets = group.marketIds
                    .map((id) => searchedData.find((item) => item.marketId === id))
                    .filter(Boolean) as TransformedMarketData[];

                  const selectGroup = () =>
                    redirectToTradePage(group.marketIds[0], group.groupId);

                  return (
                    <BodyRow
                      key={`group-${group.groupId}`}
                      role="button"
                      tabIndex={0}
                      onClick={selectGroup}
                      onKeyDown={(event) => handleRowKeyDown(event, selectGroup)}
                    >
                      <Cell>
                        <MarketIdentity>
                          {isMobile ? (
                            <RotatingLogo
                              ids={group.marketIds}
                              labels={group.outcomeLabels}
                            />
                          ) : (
                            <LogoStack>
                              {group.marketIds.slice(0, 3).map((id) => (
                                <MarketLogo
                                  key={id}
                                  src={getMarketLogo(id)}
                                  alt={group.outcomeLabels[id] ?? decodeMarketId(id)}
                                />
                              ))}
                            </LogoStack>
                          )}
                          <MarketText>
                            <MarketName>{group.title}</MarketName>
                            <MarketSubline>
                              Prediction
                              <MarketBadge>{group.marketIds.length} outcomes</MarketBadge>
                            </MarketSubline>
                          </MarketText>
                        </MarketIdentity>
                      </Cell>
                      <Cell $align="right">
                        {groupMarkets.length > 0 ? (
                          groupMarkets.slice(0, 3).map((groupMarket) => {
                            const percentage =
                              groupMarket.price === undefined
                                ? "-"
                                : `${(Number(groupMarket.price) * 100).toFixed(1)}%`;

                            return (
                              <div key={groupMarket.marketId}>
                                <NumericCellValue>
                                  {group.outcomeLabels[groupMarket.marketId] ??
                                    decodeMarketId(groupMarket.marketId)}
                                  : {percentage}
                                </NumericCellValue>
                              </div>
                            );
                          })
                        ) : (
                          <MutedDash>-</MutedDash>
                        )}
                      </Cell>
                      {!isMobile && (
                        <>
                          <Cell $align="right"><MutedDash>-</MutedDash></Cell>
                          <Cell $align="right"><MutedDash>-</MutedDash></Cell>
                        </>
                      )}
                      <Cell $align="right"><MutedDash>-</MutedDash></Cell>
                      {!isMobile && (
                        <>
                          <Cell $align="right"><MutedDash>-</MutedDash></Cell>
                          <Cell $align="right"><MutedDash>-</MutedDash></Cell>
                          <Cell $align="center"><MutedDash>-</MutedDash></Cell>
                          <Cell $align="right"><MutedDash>-</MutedDash></Cell>
                        </>
                      )}
                    </BodyRow>
                  );
                }

                const market7d = markets7d.find(
                  (marketOverview) => marketOverview.marketId === market.marketId
                );
                const isComingSoon = !defaultMarketIds.has(market.marketId);
                const isGambling = isGamblingMarket(marketName);
                const fundingValue = toNumber(market.funding);
                const oneHourChange = isGambling ? undefined : market7d?.oneHourChange;
                const twentyFourHourChange = isGambling
                  ? undefined
                  : market7d?.twentyFourHourChange;
                const sevenDayChange = isGambling ? undefined : market7d?.sevenDayChange;
                const lineColor =
                  market7d?.sevenDaysChartData &&
                  market7d.sevenDaysChartData.length > 0 &&
                  market7d.sevenDaysChartData[
                    market7d.sevenDaysChartData.length - 1
                  ] >= market7d.sevenDaysChartData[0]
                    ? theme.semantic.positive
                    : theme.semantic.negative;
                const marketClass = getMarketClass(market.marketId);
                const selectMarket = () => redirectToTradePage(market.marketId);
                const longOi = toNumber(market.longPercentageOfTotalOi) ?? 0;
                const shortOi = toNumber(market.shortPercentageOfTotalOi) ?? 0;

                return (
                  <BodyRow
                    key={market.marketId}
                    role={isComingSoon ? undefined : "button"}
                    tabIndex={isComingSoon ? undefined : 0}
                    $disabled={isComingSoon}
                    onClick={() => {
                      if (!isComingSoon) selectMarket();
                    }}
                    onKeyDown={(event) =>
                      handleRowKeyDown(event, selectMarket, isComingSoon)
                    }
                  >
                    <Cell>
                      <MarketIdentity>
                        <MarketLogo
                          src={getMarketLogo(market.marketId)}
                          alt={marketName}
                          $muted={isComingSoon}
                        />
                        <MarketText>
                          <MarketName>{marketName}</MarketName>
                          <MarketSubline>
                            {isComingSoon ? "Coming Soon" : marketClass}
                            <MarketBadge
                              $tone={
                                marketClass === MarketClass.Vanilla
                                  ? "positive"
                                  : "negative"
                              }
                            >
                              {market.priceCurrency || "USD"}
                            </MarketBadge>
                          </MarketSubline>
                        </MarketText>
                      </MarketIdentity>
                    </Cell>
                    <Cell $align="right">
                      <NumericCellValue $tone={isComingSoon ? "muted" : undefined}>
                        {formatMarketPrice(market)}
                      </NumericCellValue>
                    </Cell>
                    {!isMobile && (
                      <Cell $align="right">
                        {isGambling || isComingSoon ? (
                          <MutedDash>-</MutedDash>
                        ) : market7d ? (
                          <NumericCellValue $tone={getTone(oneHourChange)}>
                            {formatSignedPercent(oneHourChange)}
                          </NumericCellValue>
                        ) : (
                          <SkeletonBlock />
                        )}
                      </Cell>
                    )}
                    {!isMobile && (
                      <Cell $align="right">
                        {isGambling || isComingSoon ? (
                          <MutedDash>-</MutedDash>
                        ) : market7d ? (
                          <NumericCellValue $tone={getTone(twentyFourHourChange)}>
                            {formatSignedPercent(twentyFourHourChange)}
                          </NumericCellValue>
                        ) : (
                          <SkeletonBlock />
                        )}
                      </Cell>
                    )}
                    <Cell $align="right">
                      {isGambling || isComingSoon ? (
                        <MutedDash>-</MutedDash>
                      ) : market7d ? (
                        <NumericCellValue $tone={getTone(sevenDayChange)}>
                          {formatSignedPercent(sevenDayChange)}
                        </NumericCellValue>
                      ) : (
                        <SkeletonBlock />
                      )}
                    </Cell>
                    {!isMobile && (
                      <Cell $align="right">
                        {isGambling || isComingSoon ? (
                          <MutedDash>-</MutedDash>
                        ) : (
                          <NumericCellValue $tone={getTone(fundingValue)}>
                            {formatFunding(market.funding)}
                          </NumericCellValue>
                        )}
                      </Cell>
                    )}
                    {!isMobile && (
                      <Cell $align="right">
                        {isComingSoon || isGambling ? (
                          <MutedDash>-</MutedDash>
                        ) : (
                          <OiBalance>
                            <OiPercentages>
                              <span>{longOi.toFixed(0)}%</span>
                              <span>{shortOi.toFixed(0)}%</span>
                            </OiPercentages>
                            <ProgressBar
                              value={shortOi}
                              max={100}
                              width="78px"
                            />
                          </OiBalance>
                        )}
                      </Cell>
                    )}
                    {!isMobile && (
                      <Cell $align="center">
                        {market.oracleLogo ? (
                          <MarketLogo
                            src={market.oracleLogo}
                            alt={`${marketName} oracle`}
                            style={{ width: 28, height: 28 }}
                          />
                        ) : (
                          <MutedDash>-</MutedDash>
                        )}
                      </Cell>
                    )}
                    {!isMobile && (
                      <Cell $align="right">
                        {isGambling ||
                        isComingSoon ||
                        !market7d?.sevenDaysChartData?.length ? (
                          <MutedDash>-</MutedDash>
                        ) : (
                          <SparklineWrap>
                            <LineChart
                              width={118}
                              height={34}
                              data={market7d.sevenDaysChartData.map((value) => ({
                                value,
                              }))}
                            >
                              <YAxis domain={["dataMin", "dataMax"]} hide />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={lineColor}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </SparklineWrap>
                        )}
                      </Cell>
                    )}
                  </BodyRow>
                );
              })}
            </tbody>
          </MarketsTableElement>
        </TableScroll>
      ) : (
        <EmptyState>
          {isLoadingMarkets ? "Loading markets..." : "No markets match this view."}
        </EmptyState>
      )}
    </DirectoryPanel>
  );
}
