import { Flex, Box, ChevronDownIcon } from "@radix-ui/themes";
import useOutsideClick from "../../../hooks/useOutsideClick";
import React, { useState, Fragment } from "react";
import { useMarketsState } from "../../../state/markets/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import MarketItem from "./MarketItem";
import {
  HeaderMarketName,
  CurrentMarketLogo,
  MarketsListContainer,
  DropdownContainer,
  StyledScrollArea,
} from "./markets-list-styles";
import { MARKETS_FULL_LOGOS, MARKETSORDER } from "../../../constants/markets";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";

const MarketsList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const { markets } = useMarketsState();
  const { currentMarket } = useCurrentMarketState();

  const sortedMarkets =
    markets &&
    [...markets].sort((a, b) => {
      return (
        MARKETSORDER.indexOf(a.marketId) - MARKETSORDER.indexOf(b.marketId)
      );
    });

  return (
    <Box ref={ref} width={{ initial: "100%", sm: "260px" }}>
      <MarketsListContainer onClick={toggleDropdown}>
        <Flex justify={"start"} align={"center"} gap={"10px"}>
          {currentMarket && (
            <CurrentMarketLogo
              src={MARKETS_FULL_LOGOS[currentMarket.marketId]}
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
              {sortedMarkets &&
                sortedMarkets.map((market) => {
                  const currencyPrice = formatPriceWithCurrency(
                    market.parsedMid ?? 0,
                    market.priceCurrency
                  );

                  return (
                    <Fragment key={market.id}>
                      <MarketItem
                        marketLogo={MARKETS_FULL_LOGOS[market.marketId]}
                        marketName={market.marketName}
                        currencyPrice={currencyPrice}
                        marketId={market.marketId}
                        toggleDropdown={toggleDropdown}
                      />
                    </Fragment>
                  );
                })}
            </Flex>
          </StyledScrollArea>
        </DropdownContainer>
      )}
    </Box>
  );
};

export default MarketsList;
