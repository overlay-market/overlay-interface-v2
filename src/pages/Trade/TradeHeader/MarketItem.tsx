import { Flex } from "@radix-ui/themes";
import React from "react";
import {
  MarketInfo,
  MarketLogo,
  MarketName,
  MarketPrice,
} from "./market-item-styles";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";
import { isGamblingMarket } from "../../../utils/marketGuards";

type MarketItemProps = {
  marketLogo?: string;
  marketName: string;
  currencyPrice: string;
  marketId: string;
  toggleDropdown: Function;
};

const MarketItem: React.FC<MarketItemProps> = ({
  marketLogo,
  marketName,
  currencyPrice,
  marketId,
  toggleDropdown,
}) => {
  const redirectToTradePage = useRedirectToTradePage();

  const handleMarketSelect = (marketId: string) => {
    toggleDropdown();
    redirectToTradePage(marketId);
  };
  const isGambling = isGamblingMarket(marketName);

  return (
    <MarketInfo onClick={() => handleMarketSelect(marketId)}>
      <MarketLogo src={marketLogo} alt={`logo`} />
      <Flex gap={"8px"} width={"100%"} justify={"between"} align={"center"}>
        <MarketName>{marketName}</MarketName>
        <MarketPrice>{!isGambling ? currencyPrice : "-"}</MarketPrice>
      </Flex>
    </MarketInfo>
  );
};

export default MarketItem;
