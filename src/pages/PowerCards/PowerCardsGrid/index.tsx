import { UnifiedCardData } from "../types";
import { EmptyState } from "../power-cards-styles";
import { AvailableCard, BurntCard, OwnedCard } from "./PowerCard";
import { Container } from "./power-cards-grid-styles";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

interface PowerCardsGridProps {
  activeTab: number;
  allCards: UnifiedCardData[];
  userCardsData: {
    account: {
      erc1155Tokens: UnifiedCardData[];
    };
  };
  setSelectedCard: Function;
}

export function PowerCardsGrid({
  activeTab,
  allCards,
  userCardsData,
  setSelectedCard,
}: PowerCardsGridProps) {
  const userData = userCardsData?.account?.erc1155Tokens || [];

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
        userData?.map((card: UnifiedCardData) => (
          <BurntCard key={card.id} card={card} />
        ))}

      {!allCards?.length && activeTab === 0 && (
        <EmptyState>No Power Cards available</EmptyState>
      )}

      {userData.length === 0 && activeTab === 1 && (
        <EmptyState>
          No cards to display
          <a
            href="https://testnets.opensea.io/es/collection/powercard"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            See the full collection on OpenSea{" "}
            <ExternalLinkIcon
              style={{
                color: "#ff7cd5",
              }}
            />
          </a>
        </EmptyState>
      )}

      {allCards?.length === 0 && activeTab === 2 && (
        <EmptyState>No burnt Power Cards found</EmptyState>
      )}
    </Container>
  );
}
