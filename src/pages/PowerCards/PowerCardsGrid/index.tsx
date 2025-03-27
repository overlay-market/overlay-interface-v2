import { UnifiedCardData } from "../types";
import { EmptyState } from "../power-cards-styles";
import { AvailableCard, BurntCard, OwnedCard } from "./PowerCard";
import { Container } from "./power-cards-grid-styles";

interface PowerCardsGridProps {
  activeTab: number;
  allCards: UnifiedCardData[];
  userCardsData: UnifiedCardData;
  setSelectedCard: Function;
}

export function PowerCardsGrid({
  activeTab,
  allCards,
  userCardsData,
  setSelectedCard,
}: PowerCardsGridProps) {
  const userData = userCardsData.account.erc1155Tokens;

  return (
    <Container>
      {activeTab === 0 &&
        allCards.map((card: UnifiedCardData) => (
          <AvailableCard
            key={card.id}
            card={card}
            setSelectedCard={setSelectedCard}
          />
        ))}

      {activeTab === 1 &&
        userData.map((card: UnifiedCardData) => (
          <OwnedCard
            key={card.id}
            card={card}
            setSelectedCard={setSelectedCard}
          />
        ))}

      {activeTab === 2 &&
        allCards?.map((card: UnifiedCardData) => (
          <BurntCard key={card.id} card={card} />
        ))}

      {!allCards?.length && activeTab === 0 && (
        <EmptyState>No Power Cards available</EmptyState>
      )}

      {userData.length === 0 && activeTab === 1 && (
        <EmptyState>You don't own any Power Cards yet</EmptyState>
      )}

      {allCards?.length === 0 && activeTab === 2 && (
        <EmptyState>No burnt Power Cards found</EmptyState>
      )}
    </Container>
  );
}
