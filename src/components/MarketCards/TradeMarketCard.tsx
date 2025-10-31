import { Flex, Text } from "@radix-ui/themes";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";
import {
  CardImg,
  CustomCard,
  MarketDescription,
  MarketTitle,
} from "./trade-market-card-styles";
import theme from "../../theme";
import PercentWithSign from "./PercentWithSign";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { getMarketLogo } from "../../utils/getMarketLogo";
import { isGamblingMarket } from "../../utils/marketGuards";

interface TradeMarketCardProps {
  priceWithCurrency: string;
  title: string;
  id: string;
  description?: string;
  h24: number;
  funding?: string;
}

const TradeMarketCard = ({
  priceWithCurrency,
  title,
  id,
  description,
  h24,
  funding,
}: TradeMarketCardProps) => {
  const redirectToTradePage = useRedirectToTradePage();

  const titleRef = useRef<HTMLElement | null>(null);
  const [isLongTitle, setIsLongTitle] = useState(false);

  const isDoubleOrNothing = useMemo(
    () => isGamblingMarket(title),
    [title]
  );

  useLayoutEffect(() => {
    const titleElement = titleRef.current;

    if (titleElement) {
      const titleHeight = titleElement.offsetHeight;
      const lineHeight = parseFloat(getComputedStyle(titleElement).lineHeight);
      setIsLongTitle(titleHeight > lineHeight);
    }
  }, [title, titleRef.current]);

  return (
    <CustomCard onClick={() => redirectToTradePage(id)}>
      <CardImg style={{ backgroundImage: `url(${getMarketLogo(id)})` }} />

      <Flex
        direction={"column"}
        px={"8px"}
        py={"12px"}
        gap={"8px"}
        justify={"between"}
        height={"100%"}
      >
        <Flex direction={"column"} gap={"8px"}>
          <Text
            weight={"bold"}
            size={"1"}
            style={{ color: theme.color.green2 }}
          >
            {!isDoubleOrNothing ? priceWithCurrency : "-"}
          </Text>
          <MarketTitle weight={"medium"} size={"3"} ref={titleRef}>
            {title}
          </MarketTitle>
          <MarketDescription size={"1"} lineclamp={isLongTitle ? 2 : 3}>
            {description}
          </MarketDescription>
        </Flex>

        <Flex direction={"column"} gap={"4px"} mt={"auto"}>
          <Flex justify={"between"}>
            <Text size={"1"} style={{ color: theme.color.white2 }}>
              24h:
            </Text>
            <Text
              weight={"bold"}
              size={"1"}
              style={{
                color: h24 >= 0 ? theme.color.green3 : theme.color.red1,
              }}
            >
              <PercentWithSign value={!isDoubleOrNothing ? h24 : "-"} />
            </Text>
          </Flex>
          <Flex justify={"between"}>
            <Text size={"1"} style={{ color: theme.color.white2 }}>
              Funding:
            </Text>
            <Text
              weight={"bold"}
              size={"1"}
              style={{
                color:
                  Number(funding) >= 0 ? theme.color.green3 : theme.color.red1,
              }}
            >
              <PercentWithSign value={!isDoubleOrNothing ? funding : "-"} />
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </CustomCard>
  );
};

export default TradeMarketCard;
