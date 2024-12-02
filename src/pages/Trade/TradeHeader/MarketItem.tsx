import { Flex } from "@radix-ui/themes";
import React from "react";
import {
  MarketInfo,
  MarketLogo,
  MarketName,
  MarketPrice,
} from "./market-item-styles";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleMarketSelect = (marketId: string) => {
    toggleDropdown();
    navigate(`/trade/${marketId}`);
  };

  return (
    <MarketInfo
      width={"260px"}
      height={"49px"}
      py={"12px"}
      px={"8px"}
      justify={"between"}
      align={"center"}
      gap={"8px"}
      onClick={() => handleMarketSelect(marketId)}
    >
      <MarketLogo src={marketLogo} alt={`logo`} />
      <Flex gap={"8px"} width={"100%"} justify={"between"} align={"center"}>
        <MarketName>{marketName}</MarketName>
        <MarketPrice>{currencyPrice}</MarketPrice>
      </Flex>
    </MarketInfo>
  );
};

export default MarketItem;
