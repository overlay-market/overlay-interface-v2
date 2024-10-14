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
import {
  toPercentUnit,
  toScientificNumber,
} from "overlay-sdk/dist/common/utils";
import MarketItem from "./MarketItem";

const MarketsList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const { markets } = useMarketsState();
  const { currentMarket } = useCurrentMarketState();

  return (
    <Box ref={ref}>
      <Flex
        width={"260px"}
        align={"center"}
        justify={"between"}
        p={"12px"}
        gap={"10px"}
        style={{ cursor: "pointer" }}
        onClick={toggleDropdown}
      >
        <Flex justify={"start"} align={"center"} gap={"10px"}>
          <Avatar
            radius="large"
            src={currentMarket?.marketLogo}
            variant="solid"
            size="4"
            fallback={<Text style={{ fontSize: "6px" }}>{`logo`}</Text>}
            color="gray"
          />
          <Text weight={"medium"} truncate>
            {currentMarket?.marketName}
          </Text>
        </Flex>

        {isOpen ? (
          <ChevronDownIcon style={{ transform: "rotate(180deg)" }} />
        ) : (
          <ChevronDownIcon />
        )}
      </Flex>

      {isOpen && (
        <Box
          width={"260px"}
          height={"561px"}
          position={"absolute"}
          top={theme.headerSize.height}
          left={"0"}
          style={{ background: theme.color.background, zIndex: 10 }}
        >
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 530 }}>
            <Flex direction="column" align={"center"}>
              {markets &&
                markets.map((market) => {
                  const currencyPrice = `${market.priceCurrency}${
                    market.priceCurrency === "%"
                      ? toPercentUnit(market.parsedMid)
                      : toScientificNumber(market.parsedMid)
                  }`;
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