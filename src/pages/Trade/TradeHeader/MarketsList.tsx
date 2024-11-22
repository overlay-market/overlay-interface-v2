import {
  Flex,
  Text,
  Box,
  ChevronDownIcon,
  Avatar,
  ScrollArea,
} from "@radix-ui/themes";
import theme from "../../../theme";
import useOutsideClick from "../../../hooks/useOutsideClick";
import React, { useState, Fragment } from "react";
import { useMarketsState } from "../../../state/markets/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import MarketItem from "./MarketItem";
import { HeaderMarketName, MarketsListContainer } from "./markets-list-styles";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";

const MarketsList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const { markets } = useMarketsState();
  const { currentMarket } = useCurrentMarketState();

  return (
    <Box ref={ref} width={{ initial: "100%", sm: "260px" }}>
      <MarketsListContainer onClick={toggleDropdown}>
        <Flex justify={"start"} align={"center"} gap={"10px"}>
          <Avatar
            radius="large"
            src={currentMarket?.marketLogo}
            variant="solid"
            size="2"
            fallback={<Text style={{ fontSize: "6px" }}>{`logo`}</Text>}
            color="gray"
          />
          <HeaderMarketName>{currentMarket?.marketName}</HeaderMarketName>
        </Flex>

        {isOpen ? (
          <ChevronDownIcon style={{ transform: "rotate(180deg)" }} />
        ) : (
          <ChevronDownIcon />
        )}
      </MarketsListContainer>

      {isOpen && (
        <Box
          width={"260px"}
          height={"561px"}
          position={"absolute"}
          top={theme.headerSize.height}
          left={"0"}
          style={{
            background: theme.color.background,
            zIndex: 10,
            borderTop: `1px solid ${theme.color.darkBlue}`,
          }}
        >
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 530 }}>
            <Flex direction="column" align={"center"}>
              {markets &&
                markets.map((market) => {
                  const currencyPrice = `${
                    market.priceCurrency
                  }${formatPriceByCurrency(
                    market.parsedMid ?? 0,
                    market.priceCurrency
                  )}`;

                  return (
                    <Fragment key={market.id}>
                      <MarketItem
                        marketLogo={market.marketLogo}
                        marketName={market.marketName}
                        currencyPrice={currencyPrice}
                        marketId={market.marketId}
                        toggleDropdown={toggleDropdown}
                      />
                    </Fragment>
                  );
                })}
            </Flex>
          </ScrollArea>
        </Box>
      )}
    </Box>
  );
};

export default MarketsList;
