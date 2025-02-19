import { styled } from "styled-components";
import { PowerCard } from "./PowerCard";
import { CardData } from "../types";
import { EmptyState } from "../power-cards-styles";

interface PowerCardsGridProps {
  activeTab: number;
}

// Mock data - this would typically come from an API or state management
const mockCards: CardData[] = [
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
    name: "Zen Garden Gateway",
    image: "/path/to/zen-image.jpg",
    effect: "Zero Fees",
    duration: "Good for 1 day",
    rarity: "1/2000",
    status: "burnt" as const,
  },
];

export function PowerCardsGrid({ activeTab }: PowerCardsGridProps) {
  // Filter cards based on activeTab
  const filteredCards = mockCards.filter((card) => {
    switch (activeTab) {
      case 0: // All Cards
        return true;
      case 1: // My Cards
        return card.status === "owned";
      case 2: // Burnt Cards
        return card.status === "burnt";
      default:
        return true;
    }
  });

  if (filteredCards.length === 0) {
    return (
      <EmptyState>
        {activeTab === 1
          ? "You don't own any Power Cards yet"
          : activeTab === 2
          ? "No burnt Power Cards found"
          : "No Power Cards available"}
      </EmptyState>
    );
  }

  return (
    <Container>
      {filteredCards.map((card) => (
        <PowerCard key={card.id} card={card} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 16px 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;
