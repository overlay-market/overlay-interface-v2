import { PowerCardContainer } from "./power-card-styles";
import { UnifiedCardData } from "../../types";
import React, { useEffect, useState } from "react";
import { GradientSolidButton } from "../../../../components/Button";

type OwnedCardProps = {
  card: UnifiedCardData;
  setSelectedCard: Function;
};

export const OwnedCard: React.FC<OwnedCardProps> = ({
  card,
  setSelectedCard,
}) => {
  const [cardData, setCardData] = useState<{
    image: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchIpfsData = async () => {
      try {
        if (card.token?.tokenUri) {
          const ipfsUrl = `https://blush-select-dog-727.mypinata.cloud/ipfs/${card.token.tokenUri.replace(
            "ipfs://",
            ""
          )}`;
          const response = await fetch(ipfsUrl);
          const file = await response.json();
          setCardData(file);
        }
      } catch (error) {
        console.error("Error fetching IPFS data:", error);
      }
    };

    fetchIpfsData();
  }, [card]);

  if (!cardData) return <div>Loading...</div>;

  return (
    <>
      {Array.from({ length: card.amount }, (_, index) => (
        <PowerCardContainer
          key={`${card.token?.tokenId}-${index}`}
          style={{ paddingBottom: "136%" }}
          backgroundImageUrl={`https://blush-select-dog-727.mypinata.cloud/ipfs/${cardData.image.replace(
            "ipfs://",
            ""
          )}`}
        >
          <div className="card-side front">
            <img
              src={`https://blush-select-dog-727.mypinata.cloud/ipfs/${cardData.image.replace(
                "ipfs://",
                ""
              )}`}
              alt={cardData.name}
            />
          </div>
          <div className="card-side back">
            <GradientSolidButton
              handleClick={() =>
                setSelectedCard({ ...card, ipfsData: cardData }, true)
              }
              title="View More"
            />
          </div>
        </PowerCardContainer>
      ))}
    </>
  );
};
