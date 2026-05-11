import { Skeleton } from "@radix-ui/themes";
import React from "react";
import {
  ChangeValue,
  LeverageBadge,
  MarketInfo,
  MarketLogo,
  MarketName,
  MarketPrice,
  PairCell,
  PairText,
  PairTitle,
  TurnoverText,
} from "./market-item-styles";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";
import { isGamblingMarket } from "../../../utils/marketGuards";

const UNKNOWN_PRICE_CHANGE_LABEL = "LOREM IPSUM"; // TODO: Replace when the 24h overview feed has no row for a market.

type MarketItemProps = {
  marketLogo?: string;
  marketName: string;
  currencyPrice: string;
  maxLeverage: string;
  turnover: string;
  priceChange?: number;
  priceChangeLoading?: boolean;
  active?: boolean;
  marketId: string;
  toggleDropdown: Function;
};

const MarketItem: React.FC<MarketItemProps> = ({
  marketLogo,
  marketName,
  currencyPrice,
  maxLeverage,
  turnover,
  priceChange,
  priceChangeLoading,
  active = false,
  marketId,
  toggleDropdown,
}) => {
  const redirectToTradePage = useRedirectToTradePage();

  const handleMarketSelect = (marketId: string) => {
    toggleDropdown();
    redirectToTradePage(marketId);
  };
  const isGambling = isGamblingMarket(marketName);
  const hasPriceChange = typeof priceChange === "number";
  const priceChangeLabel = hasPriceChange
    ? `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`
    : UNKNOWN_PRICE_CHANGE_LABEL;

  return (
    <MarketInfo
      type="button"
      $active={active}
      onClick={() => handleMarketSelect(marketId)}
      aria-label={`Select ${marketName}`}
    >
      <PairCell>
        <MarketLogo src={marketLogo} alt="" />
        <PairText>
          <PairTitle>
            <MarketName>{marketName}</MarketName>
            <LeverageBadge>{maxLeverage}</LeverageBadge>
          </PairTitle>
          <TurnoverText>{turnover}</TurnoverText>
        </PairText>
      </PairCell>
      <MarketPrice>{!isGambling ? currencyPrice : "-"}</MarketPrice>
      <ChangeValue
        $positive={(priceChange ?? 0) >= 0}
        $empty={!hasPriceChange}
      >
        {priceChangeLoading ? (
          <Skeleton width="64px" height="14px" />
        ) : (
          priceChangeLabel
        )}
      </ChangeValue>
    </MarketInfo>
  );
};

export default MarketItem;
