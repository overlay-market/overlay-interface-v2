import { Flex, ChevronDownIcon } from "@radix-ui/themes";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import useOutsideClick from "../../../hooks/useOutsideClick";
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import MarketItem from "./MarketItem";
import {
  CategoryTab,
  CategoryScrollButton,
  CategoryTabs,
  CategoryTabsShell,
  HeaderMarketName,
  HeaderActions,
  HeaderFavoriteIcon,
  HeaderLeverageBadge,
  HeaderMarketText,
  HeaderRight,
  CurrentMarketLogo,
  DropdownContent,
  MarketsListContainer,
  DropdownContainer,
  DropdownTop,
  MarketSelectorRoot,
  MarketsTableHeader,
  SearchShell,
  StyledScrollArea,
  SearchEmptyMessage,
} from "./markets-list-styles";
import {
  CategoryName,
  MARKET_CATEGORIES,
  MARKETSORDER,
  PredictionMarketGroup,
} from "../../../constants/markets";
import {
  formatNumberWithCommas,
  formatPriceWithCurrency,
} from "../../../utils/formatPriceWithCurrency";
import { getMarketLogo } from "../../../utils/getMarketLogo";
import SearchBar from "../../../components/SearchBar";
import useActiveMarkets from "../../../hooks/useActiveMarkets";
import { useMarkets7d } from "../../../hooks/useMarkets7d";
import { Address, formatUnits } from "viem";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { formatWeiToParsedNumber } from "overlay-sdk";

interface MarketsListProps {
  predictionGroup?: PredictionMarketGroup;
}

const CATEGORY_ORDER: CategoryName[] = [
  CategoryName.Majors,
  CategoryName.Crypto,
  CategoryName.Altcoins,
  CategoryName.Indices,
  CategoryName.Prediction,
  CategoryName.Gambling,
  CategoryName.CounterStrikeSkins,
  CategoryName.Bera,
  CategoryName.MemeWar,
  CategoryName.OrdinalNft,
  CategoryName.Twitter,
  CategoryName.YouTube,
  CategoryName.Chess,
  CategoryName.Artists,
  CategoryName.Fansly,
  CategoryName.Other,
];

const UNKNOWN_LEVERAGE_LABEL = "LOREM IPSUM"; // TODO: Replace when the active market payload does not include capLeverage.

const decodeMarketId = (marketId: string) => {
  try {
    return decodeURIComponent(marketId);
  } catch {
    return marketId;
  }
};

const formatLeverage = (capLeverage?: string | number) => {
  const leverage = Number(capLeverage);

  if (!Number.isFinite(leverage) || leverage <= 0) {
    return UNKNOWN_LEVERAGE_LABEL;
  }

  return `${Number.isInteger(leverage) ? leverage : leverage.toFixed(1).replace(/\.0$/, "")}x`;
};

const formatTurnover = (volumeAsk?: string, volumeBid?: string) => {
  try {
    const totalVolume = BigInt(volumeAsk || "0") + BigInt(volumeBid || "0");
    const formattedUnits = formatUnits(totalVolume, 18);
    const turnover = Number(formattedUnits);

    if (!Number.isFinite(turnover) || turnover <= 0) {
      return "-";
    }

    return formatNumberWithCommas(turnover);
  } catch {
    return "-";
  }
};

const MarketsList: React.FC<MarketsListProps> = ({ predictionGroup }) => {
  const { currentMarket } = useCurrentMarketState();
  const { data: markets } = useActiveMarkets();
  const sdk = useSDK();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [marketLeverageCaps, setMarketLeverageCaps] = useState<
    Record<string, string | number | null>
  >({});
  const [categoryScrollState, setCategoryScrollState] = useState({
    left: false,
    right: false,
  });

  const ref = useOutsideClick(() => setIsOpen(false));
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setSearchTerm("");
  };

  const marketToCategoryMap = useMemo(() => {
    return Object.entries(MARKET_CATEGORIES).reduce(
      (acc, [category, marketList]) => {
        for (const encodedMarket of marketList) {
          const decodedMarket = decodeURIComponent(encodedMarket);
          acc[decodedMarket] = category as CategoryName;
        }
        return acc;
      },
      {} as Record<string, CategoryName>
    );
  }, []);

  const sortedMarkets = useMemo(() => {
    return markets
      ? [...markets].sort(
          (a, b) =>
            MARKETSORDER.indexOf(a.marketId) - MARKETSORDER.indexOf(b.marketId)
        )
      : [];
  }, [markets]);

  const marketIds = useMemo(
    () => sortedMarkets.map((market) => market.marketId),
    [sortedMarkets]
  );

  const marketsPriceOverview = useMarkets7d(marketIds);

  const marketsPriceChangeById = useMemo(() => {
    return new Map(
      marketsPriceOverview.map((market) => [
        market.marketId,
        market.twentyFourHourChange,
      ])
    );
  }, [marketsPriceOverview]);

  useEffect(() => {
    if (!isOpen || sortedMarkets.length === 0) return;

    const missingLeverageMarkets = sortedMarkets.filter(
      (market) =>
        !market.capLeverage && !(market.marketId in marketLeverageCaps)
    );

    if (missingLeverageMarkets.length === 0) return;

    let cancelled = false;

    const fetchLeverageCaps = async () => {
      const leverageEntries = await Promise.all(
        missingLeverageMarkets.map(async (market) => {
          try {
            const capLeverage = await sdk.market.getCapLeverage(
              market.id as Address
            );
            return [
              market.marketId,
              formatWeiToParsedNumber(capLeverage, 18, 2) ?? null,
            ] as const;
          } catch {
            return [market.marketId, null] as const;
          }
        })
      );

      if (cancelled) return;

      setMarketLeverageCaps((prev) => ({
        ...prev,
        ...Object.fromEntries(leverageEntries),
      }));
    };

    fetchLeverageCaps();

    return () => {
      cancelled = true;
    };
  }, [isOpen, marketLeverageCaps, sdk, sortedMarkets]);

  const getMarketCategory = useMemo(() => {
    return (marketName: string, marketId: string) => {
      return (
        marketToCategoryMap[marketName] ??
        marketToCategoryMap[decodeMarketId(marketId)] ??
        CategoryName.Other
      );
    };
  }, [marketToCategoryMap]);

  const categoryOptions = useMemo<(CategoryName | "All")[]>(() => {
    if (!sortedMarkets.length) return ["All"];

    const liveCategories = new Set<CategoryName>();
    sortedMarkets.forEach((market) => {
      liveCategories.add(getMarketCategory(market.marketName, market.marketId));
    });

    return [
      "All",
      ...CATEGORY_ORDER.filter((category) => liveCategories.has(category)),
      ...(Object.values(CategoryName) as CategoryName[]).filter(
        (category) =>
          liveCategories.has(category) && !CATEGORY_ORDER.includes(category)
      ),
    ];
  }, [getMarketCategory, sortedMarkets]);

  const [selectedCategory, setSelectedCategory] = useState<
    CategoryName | "All"
  >("All");

  const filteredMarkets = useMemo(() => {
    return sortedMarkets.filter((market) => {
      const category = getMarketCategory(market.marketName, market.marketId);
      const categoryFilterMatch =
        selectedCategory === "All" || category === selectedCategory;
      const nameMatch = market.marketName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const categoryMatch = category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return categoryFilterMatch && (nameMatch || categoryMatch);
    });
  }, [sortedMarkets, getMarketCategory, selectedCategory, searchTerm]);

  const updateCategoryScrollState = useCallback(() => {
    const element = categoryTabsRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    setCategoryScrollState({
      left: element.scrollLeft > 1,
      right: element.scrollLeft < maxScrollLeft - 1,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const element = categoryTabsRef.current;
    if (!element) return;

    const handleScroll = () => updateCategoryScrollState();
    const handleResize = () => updateCategoryScrollState();
    const frame = window.requestAnimationFrame(updateCategoryScrollState);

    element.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [categoryOptions, isOpen, updateCategoryScrollState]);

  const scrollCategoryTabs = (direction: "left" | "right") => {
    categoryTabsRef.current?.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth",
    });
  };

  return (
    <MarketSelectorRoot ref={ref}>
      <MarketsListContainer
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Flex justify={"start"} align={"center"} gap={"12px"} minWidth="0">
          {currentMarket && (
            <CurrentMarketLogo
              src={getMarketLogo(currentMarket.marketId)}
              alt={currentMarket.marketName}
            />
          )}
          <HeaderMarketText>
            <HeaderMarketName>
              {predictionGroup ? predictionGroup.title : currentMarket?.marketName}
            </HeaderMarketName>
            <HeaderLeverageBadge>
              {formatLeverage(currentMarket?.capLeverage)}
            </HeaderLeverageBadge>
          </HeaderMarketText>
        </Flex>

        <HeaderActions>
          {isOpen ? (
            <ChevronDownIcon style={{ transform: "rotate(180deg)" }} />
          ) : (
            <ChevronDownIcon />
          )}
          <HeaderFavoriteIcon aria-hidden="true">
            <StarIcon />
          </HeaderFavoriteIcon>
        </HeaderActions>
      </MarketsListContainer>

      {isOpen && (
        <DropdownContainer>
          <StyledScrollArea>
            <DropdownContent>
              <DropdownTop>
                <SearchShell>
                  <SearchBar
                    searchTerm={searchTerm}
                    placeholder={"Search"}
                    setSearchTerm={setSearchTerm}
                  />
                </SearchShell>
              </DropdownTop>

              <CategoryTabsShell>
                <CategoryScrollButton
                  type="button"
                  aria-label="Scroll categories left"
                  $visible={categoryScrollState.left}
                  disabled={!categoryScrollState.left}
                  onClick={() => scrollCategoryTabs("left")}
                >
                  <ChevronLeftIcon />
                </CategoryScrollButton>

                <CategoryTabs
                  ref={categoryTabsRef}
                  aria-label="Market categories"
                >
                  {categoryOptions.map((category) => (
                    <CategoryTab
                      key={category}
                      type="button"
                      $active={selectedCategory === category}
                      aria-pressed={selectedCategory === category}
                      onClick={(event) => {
                        setSelectedCategory(category);
                        event.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }}
                    >
                      {category === "All" ? "All" : category}
                    </CategoryTab>
                  ))}
                </CategoryTabs>

                <CategoryScrollButton
                  type="button"
                  aria-label="Scroll categories right"
                  $visible={categoryScrollState.right}
                  disabled={!categoryScrollState.right}
                  onClick={() => scrollCategoryTabs("right")}
                >
                  <ChevronRightIcon />
                </CategoryScrollButton>
              </CategoryTabsShell>

              <MarketsTableHeader>
                <span>Pairs / Turnover</span>
                <HeaderRight>Price</HeaderRight>
                <HeaderRight>Chg %</HeaderRight>
              </MarketsTableHeader>

              {filteredMarkets && filteredMarkets.length > 0 ? (
                filteredMarkets.map((market) => {
                  const priceChange = marketsPriceChangeById.get(
                    market.marketId
                  );
                  const priceChangeLoading = marketsPriceOverview.length === 0;

                  return (
                    <MarketItem
                      key={market.id}
                      marketLogo={getMarketLogo(market.marketId)}
                      marketName={market.marketName}
                      currencyPrice={formatPriceWithCurrency(
                        market.parsedMid ?? 0,
                        market.priceCurrency
                      )}
                      maxLeverage={formatLeverage(
                        marketLeverageCaps[market.marketId] ??
                          market.capLeverage
                      )}
                      turnover={formatTurnover(market.volumeAsk, market.volumeBid)}
                      priceChange={priceChange}
                      priceChangeLoading={priceChangeLoading}
                      active={market.marketId === currentMarket?.marketId}
                      marketId={market.marketId}
                      toggleDropdown={toggleDropdown}
                    />
                  );
                })
              ) : searchTerm ? (
                <SearchEmptyMessage>No markets found</SearchEmptyMessage>
              ) : null}
            </DropdownContent>
          </StyledScrollArea>
        </DropdownContainer>
      )}
    </MarketSelectorRoot>
  );
};

export default MarketsList;
