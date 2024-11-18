import {
  CardContent,
  CustomCard,
  CardsValue,
  CardsTitle,
} from "./market-cards-styles";

interface MarketCardsProps {
  value: string;
  title: string;
  image: string;
}

const MarketCards = ({ value, title, image }: MarketCardsProps) => {
  return (
    <CustomCard style={{ backgroundImage: `url(${image})` }}>
      <CardContent direction="column" align="center">
        <CardsValue>{value}</CardsValue>
        <CardsTitle>{title}</CardsTitle>
      </CardContent>
    </CustomCard>
  );
};

export default MarketCards;
