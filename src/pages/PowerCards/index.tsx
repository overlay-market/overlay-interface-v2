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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    return tab ? parseInt(tab) : 0;
  });
  const [selectedCard, setSelectedCard] = useState<UnifiedCardData | null>(
    null
  );
  const [isOwned, setIsOwned] = useState(false);

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
    navigate(`/power-cards?view=details&tab=${activeTab}`, {
      state: { card, isOwned },
      replace: true,
    });
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    navigate(`/power-cards?tab=${index}`, { replace: true });
  };

  const handleHeaderBackClick = () => {
    setSelectedCard(null);
    setIsOwned(false);
    navigate(`/power-cards?tab=${activeTab}`, { replace: true });
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

    if (allCardsData?.erc1155Tokens?.length > 0) {
      fetchIpfsData(allCardsData.erc1155Tokens).then(setAllCardsWithIpfs);
    }
  }, [allCardsData]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      setActiveTab(parseInt(tab));
    }

    if (!location.search && !location.state?.card) {
      setSelectedCard(null);
      setIsOwned(false);
    } else if (location.state?.card) {
      setSelectedCard(location.state.card);
      setIsOwned(location.state.isOwned);
    }
  }, [location, searchParams]);

  if (allCardsError || userCardsError) {
    return <p>Error: {allCardsError?.message || userCardsError?.message}</p>;
  }

  return (
    <Container>
      <PowerCardsHeader
        cardTitle={selectedCard?.ipfsData?.name ?? null}
        setSelectedCard={handleHeaderBackClick}
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
          <div style={{ alignSelf: "center" }}>
            <OpenedPowerCard card={selectedCard} isOwned={isOwned} />
          </div>
        ) : allCardsLoading || userCardsLoading ? null : (
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
