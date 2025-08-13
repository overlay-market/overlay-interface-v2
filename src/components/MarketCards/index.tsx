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
  isComingSoon?: boolean;
}

const MarketCards = ({
  priceWithCurrency,
  title,
  id,
  isComingSoon = false,
}: MarketCardsProps) => {
  const redirectToTradePage = useRedirectToTradePage();
  return (
    <Skeleton loading={false}>
      <CustomCard
        style={{
          backgroundImage: `url(${getMarketLogo(id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: isComingSoon ? "default" : "pointer",
          width: 200,
          position: "relative",
          filter: isComingSoon ? "grayscale(100%) brightness(0.6)" : "none",
        }}
        onClick={() => !isComingSoon && redirectToTradePage(id)}
      >
        {isComingSoon && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            COMING SOON
          </div>
        )}
        <CardContent direction="column" align="center" style={{ zIndex: isComingSoon ? 3 : 1, position: "relative" }}>
          <CardsValue style={{ opacity: 1 }}>
            {priceWithCurrency}
          </CardsValue>
          <CardsTitle style={{ opacity: isComingSoon ? 0.7 : 1 }}>
            {title}
          </CardsTitle>
        </CardContent>
      </CustomCard>
    </Skeleton>
  );
};

export default MarketCards;
