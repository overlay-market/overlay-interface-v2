import { useState } from "react";
import { PowerCardsGrid } from "./PowerCardsGrid";
import { Container, TabsContainer, Tab } from "./power-cards-styles";
import PowerCardsHeader from "./PowerCardsHeader";
import { Flex } from "@radix-ui/themes";

const tabs = ["All Cards", "My Cards", "Burnt Cards"];

export default function PowerCards() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container>
      <PowerCardsHeader />
      <Flex
        direction={"column"}
        gap={{ initial: "24px", sm: "28px", md: "32px" }}
        pt={"16px"}
        pl={{ initial: "4px", sm: "16px", md: "12px" }}
        pr={{ initial: "4px", sm: "0px" }}
      >
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
        <PowerCardsGrid activeTab={activeTab} />
      </Flex>
    </Container>
  );
}
