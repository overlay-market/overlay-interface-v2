import {
  CardContent,
  CustomCard,
  CardsValue,
  CardsTitle,
} from "./market-cards-styles";
import { Skeleton } from "@radix-ui/themes";
import { MARKETS_FULL_LOGOS } from "../../constants/markets";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";

interface MarketCardsProps {
  value: string | number | undefined;
  title: string;
  id: string;
  currency: string;
}

const MarketCards = ({ value, title, id, currency }: MarketCardsProps) => {
  const redirectToTradePage = useRedirectToTradePage();
  return (
    <Skeleton loading={false}>
      <CustomCard
        style={{
          backgroundImage: `url(${MARKETS_FULL_LOGOS[id]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
        }}
        onClick={() => redirectToTradePage(id)}
      >
        <CardContent direction="column" align="center">
          <CardsValue>{currency + value}</CardsValue>
          <CardsTitle>{title}</CardsTitle>
        </CardContent>
      </CustomCard>
    </Skeleton>
  );
};

export default MarketCards;
