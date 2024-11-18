import {
  CardContent,
  CustomCard,
  CardsValue,
  CardsTitle,
} from "./market-cards-styles";

interface MarketCardsProps {
  value: string | number | undefined;
  title: string;
  image: string;
  currency: string;
}

const MarketCards = ({ value, title, image, currency }: MarketCardsProps) => {
  return (
    <CustomCard
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CardContent direction="column" align="center">
        <CardsValue>{currency + value}</CardsValue>
        <CardsTitle>{title}</CardsTitle>
      </CardContent>
    </CustomCard>
  );
};

export default MarketCards;
