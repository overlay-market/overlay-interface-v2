import { useState } from "react";
import { PowerCardsGrid } from "./PowerCardsGrid";
import {
  Container,
  TabsContainer,
  Tab,
  PowercardsContent,
} from "./power-cards-styles";
import PowerCardsHeader from "./PowerCardsHeader";
import { CardData } from "./types";
import OpenedPowerCard from "./OpenedPowerCard";

const tabs = ["All Cards", "My Cards", "Burnt Cards"];

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
  {
    id: 4,
    name: "Zen Garden Gateway",
    image: "/path/to/zen-image.jpg",
    effect: "Zero Fees",
    duration: "Good for 1 day",
    rarity: "1/2000",
    status: "burnt" as const,
  },
];

const PowerCards = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  return (
    <Container>
      <PowerCardsHeader
        cardTitle={selectedCard?.name ?? null}
        setSelectedCard={setSelectedCard}
      />

      <PowercardsContent>
        {!selectedCard && (
          <TabsContainer>
            {tabs.map((tab, index) => (
              <Tab
                key={tab}
                active={activeTab === index}
                onClick={() => setActiveTab(index)}
                data-text={tab}
              >
                {tab}
              </Tab>
            ))}
          </TabsContainer>
        )}

        {selectedCard ? (
          <OpenedPowerCard card={selectedCard} />
        ) : (
          <PowerCardsGrid
            activeTab={activeTab}
            cards={mockCards}
            setSelectedCard={setSelectedCard}
          />
        )}
      </PowercardsContent>
    </Container>
  );
};

export default PowerCards;
