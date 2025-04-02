import {
  CardContent,
  CustomCard,
  CardsValue,
  CardsTitle,
} from "./market-cards-styles";
import { Skeleton } from "@radix-ui/themes";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";
import { getMarketLogo } from "../../utils/getMarketLogo";

interface MarketCardsProps {
  priceWithCurrency: string;
  title: string;
  id: string;
}

const MarketCards = ({ priceWithCurrency, title, id }: MarketCardsProps) => {
  const redirectToTradePage = useRedirectToTradePage();
  return (
    <Skeleton loading={false}>
      <CustomCard
        style={{
          backgroundImage: `url(${getMarketLogo(id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
          width: 200,
        }}
        onClick={() => redirectToTradePage(id)}
      >
        <CardContent direction="column" align="center">
          <CardsValue>{priceWithCurrency}</CardsValue>
          <CardsTitle>{title}</CardsTitle>
        </CardContent>
      </CustomCard>
    </Skeleton>
  );
};

export default MarketCards;
