import { CardData } from "../../types";
import {
  PowerCardContainer,
  CardImage,
  CardContent,
  CardTitle,
  CardDescription,
  CardStats,
} from "./power-card-styles";

interface PowerCardProps {
  card: CardData;
}

export function PowerCard({ card }: PowerCardProps) {
  return (
    <PowerCardContainer>
      <CardImage src={card.image} alt={card.name} />
      <CardContent>
        <CardTitle>{card.name}</CardTitle>
        <CardDescription>{card.effect}</CardDescription>
        <CardStats>
          <div>{card.duration}</div>
          <div>{card.rarity}</div>
        </CardStats>
      </CardContent>
    </PowerCardContainer>
  );
}
