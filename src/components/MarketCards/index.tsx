import {
  CardContent,
  CustomCard,
  CardsValue,
  CardsTitle,
  ComingSoonBanner,
  ComingSoonOverlay,
} from "./market-cards-styles";
import { Skeleton } from "@radix-ui/themes";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";
import { getMarketLogo } from "../../utils/getMarketLogo";

interface MarketCardsProps {
  priceWithCurrency: string;
  title: string;
  id: string;
  comingSoon?: boolean;
}

const MarketCards = ({
  priceWithCurrency,
  title,
  id,
  comingSoon = false,
}: MarketCardsProps) => {
  const redirectToTradePage = useRedirectToTradePage();
  return (
    <Skeleton loading={false}>
      <CustomCard
        style={{
          backgroundImage: `url(${getMarketLogo(id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: comingSoon ? "default" : "pointer",
          width: 200,
        }}
        onClick={() => !comingSoon && redirectToTradePage(id)}
      >
        {comingSoon && (
          <>
            <ComingSoonOverlay />
            <ComingSoonBanner>COMING SOON</ComingSoonBanner>
          </>
        )}
        <CardContent direction="column" align="center">
          <CardsValue>{priceWithCurrency}</CardsValue>
          <CardsTitle>{title}</CardsTitle>
        </CardContent>
      </CustomCard>
    </Skeleton>
  );
};

export default MarketCards;
