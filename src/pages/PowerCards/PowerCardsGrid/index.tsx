import { CardData } from "../types";
import { EmptyState } from "../power-cards-styles";
import { AvailableCard, BurntCard, OwnedCard } from "./PowerCard";
import { Container } from "./power-cards-grid-styles";

interface PowerCardsGridProps {
  activeTab: number;
  cards: CardData[];
  setSelectedCard: Function;
}

// Mock data - this would typically come from an API or state management
const ownedCards: CardData[] = [
  {
    id: 1,
    name: "Breeze of Mt Fuji",
    image: "/path/to/fuji-image.jpg",
    effect: "Negative Fees",
    duration: "Good for 1 day",
    rarity: "1/2000",
    status: "available" as const,
  },
  {
    id: 2,
    name: "Samurai Jack",
    image: "/path/to/samurai-image.jpg",
    effect: "Rebate",
    duration: "On one loss up to 10 OV",
    rarity: "1/5000",
    status: "owned" as const,
  },
  {
    id: 3,
    name: "Samurai Jack",
    image: "/path/to/samurai-image.jpg",
    effect: "Rebate",
    duration: "On one loss up to 10 OV",
    rarity: "1/5000",
    status: "owned" as const,
  },
  {
    id: 4,
    name: "Samurai Jack",
    image: "/path/to/samurai-image.jpg",
    effect: "Rebate",
    duration: "On one loss up to 10 OV",
    rarity: "1/5000",
    status: "owned" as const,
  },
];

const burntCards: CardData[] = [
  {
    id: 1,
    name: "Breeze of Mt Fuji",
    image: "/path/to/fuji-image.jpg",
    effect: "Negative Fees",
    duration: "Good for 1 day",
    rarity: "1/2000",
    status: "available" as const,
  },
];

export function PowerCardsGrid({
  activeTab,
  cards,
  setSelectedCard,
}: PowerCardsGridProps) {
  return (
    <Container>
      {activeTab === 0 &&
        cards.map((card) => (
          <AvailableCard
            key={card.id}
            card={card}
            setSelectedCard={setSelectedCard}
            isOwned={false}
          />
        ))}

      {activeTab === 1 &&
        ownedCards.map((card) => (
          <OwnedCard
            key={card.id}
            card={card}
            setSelectedCard={setSelectedCard}
          />
        ))}

      {activeTab === 2 &&
        burntCards.map((card) => <BurntCard key={card.id} card={card} />)}

      {cards.length === 0 && activeTab === 0 && (
        <EmptyState>No Power Cards available</EmptyState>
      )}

      {ownedCards.length === 0 && activeTab === 1 && (
        <EmptyState>You don't own any Power Cards yet</EmptyState>
      )}

      {burntCards.length === 0 && activeTab === 2 && (
        <EmptyState>No burnt Power Cards found</EmptyState>
      )}
    </Container>
  );
}
