import { useState, useEffect } from "react";
import { PowerCardsGrid } from "./PowerCardsGrid";
import {
  Container,
  TabsContainer,
  Tab,
  PowercardsContent,
} from "./power-cards-styles";
import PowerCardsHeader from "./PowerCardsHeader";
import { UnifiedCardData } from "./types";
import OpenedPowerCard from "./OpenedPowerCard";
import {
  useAllPowerCards,
  useUserPowerCards,
} from "../../hooks/useUserPowerCards";

const tabs = ["All Cards", "My Cards", "Burnt Cards"];

interface ERC1155Token {
  __typename: string;
  address: string;
  id: string;
  tokenId: string;
  tokenUri: string;
  totalBurnt: string;
  totalSupply: string;
  ipfsData?: ERC1155Token;
}

const PowerCards = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("powerCardsActiveTab");
    return savedTab ? parseInt(savedTab) : 0;
  });

  const [selectedCard, setSelectedCard] = useState<UnifiedCardData | null>(
    () => {
      const savedCard = localStorage.getItem("powerCardsSelectedCard");
      return savedCard ? JSON.parse(savedCard) : null;
    }
  );

  const [isOwned, setIsOwned] = useState<boolean>(() => {
    const savedIsOwned = localStorage.getItem("powerCardsIsOwned");
    return savedIsOwned ? JSON.parse(savedIsOwned) : false;
  });

  const {
    loading: allCardsLoading,
    error: allCardsError,
    data: allCardsData,
  } = useAllPowerCards();
  const {
    loading: userCardsLoading,
    error: userCardsError,
    data: userCardsData,
  } = useUserPowerCards();
  const [allCardsWithIpfs, setAllCardsWithIpfs] = useState<UnifiedCardData[]>(
    []
  );

  const handleSetSelectedCard = (card: UnifiedCardData, isOwned: boolean) => {
    setSelectedCard(card);
    setIsOwned(isOwned);
    localStorage.setItem("powerCardsSelectedCard", JSON.stringify(card));
    localStorage.setItem("powerCardsIsOwned", JSON.stringify(isOwned));
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    localStorage.setItem("powerCardsActiveTab", index.toString());
  };

  useEffect(() => {
    const fetchIpfsData = async (tokens: ERC1155Token[]) => {
      if (!tokens?.length) return [];

      const updatedCards = await Promise.all(
        tokens.map(async (token: ERC1155Token) => {
          try {
            if (token.tokenUri) {
              const ipfsUrl = `https://blush-select-dog-727.mypinata.cloud/ipfs/${token.tokenUri.replace(
                "ipfs://",
                ""
              )}`;
              const response = await fetch(ipfsUrl);
              const file = await response.json();
              return {
                id: token.tokenId.toString(),
                name: token.tokenUri || "Unknown Name",
                image: token.address,
                status: "available",
                address: token.address,
                ipfsData: file,
              };
            }
          } catch (error) {
            console.error("Error processing token:", error);
          }
          return null;
        })
      );

      return updatedCards.filter(Boolean) as UnifiedCardData[];
    };

    // Process all cards only
    if (allCardsData?.erc1155Tokens?.length > 0) {
      fetchIpfsData(allCardsData.erc1155Tokens).then(setAllCardsWithIpfs);
    }
  }, [allCardsData]);

  if (allCardsLoading || userCardsLoading) {
    return <p>Loading...</p>;
  }

  if (allCardsError || userCardsError) {
    return <p>Error: {allCardsError?.message || userCardsError?.message}</p>;
  }

  return (
    <Container>
      <PowerCardsHeader
        cardTitle={selectedCard?.ipfsData?.name ?? null}
        setSelectedCard={(card: UnifiedCardData | null) => {
          setSelectedCard(card);
          if (card === null) {
            localStorage.removeItem("powerCardsSelectedCard");
            localStorage.removeItem("powerCardsIsOwned");
          }
        }}
      />

      <PowercardsContent>
        {!selectedCard && (
          <TabsContainer>
            {tabs.map((tab, index) => (
              <Tab
                key={tab}
                active={activeTab === index}
                onClick={() => handleTabChange(index)}
                data-text={tab}
              >
                {tab}
              </Tab>
            ))}
          </TabsContainer>
        )}

        {selectedCard ? (
          <OpenedPowerCard card={selectedCard} isOwned={isOwned} />
        ) : (
          <PowerCardsGrid
            activeTab={activeTab}
            allCards={allCardsWithIpfs}
            userCardsData={userCardsData}
            setSelectedCard={handleSetSelectedCard}
          />
        )}
      </PowercardsContent>
    </Container>
  );
};

export default PowerCards;
