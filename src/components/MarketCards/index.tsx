import {
  CardContent,
  CustomCard,
  CardsValue,
  CardsTitle,
  CardImage,
} from "./market-cards-styles";
import { Skeleton } from "@radix-ui/themes";
import { MARKETS_FULL_LOGOS } from "../../constants/markets";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";

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
          cursor: "pointer",
          width: 200,
        }}
        onClick={() => redirectToTradePage(id)}
      >
        <CardImage
          src={MARKETS_FULL_LOGOS[id]}
          alt={`${title} market`}
          fetchPriority="high"
        />
        <CardContent direction="column" align="center">
          <CardsValue>{priceWithCurrency}</CardsValue>
          <CardsTitle>{title}</CardsTitle>
        </CardContent>
      </CustomCard>
    </Skeleton>
  );
};

export default MarketCards;
