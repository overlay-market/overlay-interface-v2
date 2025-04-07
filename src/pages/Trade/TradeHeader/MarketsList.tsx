import { Flex, Box, ChevronDownIcon } from "@radix-ui/themes";
import useOutsideClick from "../../../hooks/useOutsideClick";
import React, { useState, Fragment, useMemo } from "react";
import { useMarketsState } from "../../../state/markets/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import MarketItem from "./MarketItem";
import {
  HeaderMarketName,
  CurrentMarketLogo,
  MarketsListContainer,
  DropdownContainer,
  StyledScrollArea,
  SearchEmptyMessage,
} from "./markets-list-styles";
import {
  CategoryName,
  MARKET_CATEGORIES,
  MARKETSORDER,
} from "../../../constants/markets";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import { getMarketLogo } from "../../../utils/getMarketLogo";
import SearchItem from "./SearchItem";

const MarketsList: React.FC = () => {
  const { markets } = useMarketsState();
  const { currentMarket } = useCurrentMarketState();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const ref = useOutsideClick(() => setIsOpen(false));

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

  const filteredMarkets = useMemo(() => {
    return sortedMarkets.filter((market) => {
      const nameMatch = market.marketName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const category = marketToCategoryMap[market.marketName];
      const categoryMatch = category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return nameMatch || categoryMatch;
    });
  }, [sortedMarkets, searchTerm, marketToCategoryMap]);

  return (
    <Box ref={ref} width={{ initial: "100%", sm: "260px" }}>
      <MarketsListContainer onClick={toggleDropdown}>
        <Flex justify={"start"} align={"center"} gap={"10px"}>
          {currentMarket && (
            <CurrentMarketLogo
              src={getMarketLogo(currentMarket.marketId)}
              alt={currentMarket.marketName}
            />
          )}
          <HeaderMarketName>{currentMarket?.marketName}</HeaderMarketName>
        </Flex>

        {isOpen ? (
          <ChevronDownIcon style={{ transform: "rotate(180deg)" }} />
        ) : (
          <ChevronDownIcon />
        )}
      </MarketsListContainer>

      {isOpen && (
        <DropdownContainer>
          <StyledScrollArea>
            <Flex direction="column" align={"center"}>
              <SearchItem
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              {filteredMarkets && filteredMarkets.length > 0 ? (
                filteredMarkets.map((market) => (
                  <Fragment key={market.id}>
                    <MarketItem
                      marketLogo={getMarketLogo(market.marketId)}
                      marketName={market.marketName}
                      currencyPrice={formatPriceWithCurrency(
                        market.parsedMid ?? 0,
                        market.priceCurrency
                      )}
                      marketId={market.marketId}
                      toggleDropdown={toggleDropdown}
                    />
                  </Fragment>
                ))
              ) : searchTerm ? (
                <SearchEmptyMessage>No markets found</SearchEmptyMessage>
              ) : null}
            </Flex>
          </StyledScrollArea>
        </DropdownContainer>
      )}
    </Box>
  );
};

export default MarketsList;
