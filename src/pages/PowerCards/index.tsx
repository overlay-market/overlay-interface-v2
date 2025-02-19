import { useState } from "react";
import { PowerCardsGrid } from "./PowerCardsGrid";
import {
  Container,
  ContentArea,
  TabsContainer,
  Tab,
} from "./power-cards-styles";
import PowerCardsHeader from "./PowerCardsHeader";

const tabs = ["All Cards", "My Cards", "Burnt Cards"];

export default function PowerCards() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container>
      <PowerCardsHeader />
      <ContentArea>
        <TabsContainer>
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              active={activeTab === index}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </Tab>
          ))}
        </TabsContainer>
        <PowerCardsGrid activeTab={activeTab} />
      </ContentArea>
    </Container>
  );
}
