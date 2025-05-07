import { PowerCardContainer } from "./power-card-styles";
import { UnifiedCardData } from "../../types";
import { POWER_CARDS_LOGOS } from "../../../../constants/powercards";
import { useState, useEffect } from "react";
import { Skeleton } from "@radix-ui/themes";

type AvailableCardProps = {
  card: UnifiedCardData;
  setSelectedCard: Function;
};

export const AvailableCard: React.FC<AvailableCardProps> = ({
  card,
  setSelectedCard,
}) => {
  const cardImage = POWER_CARDS_LOGOS[card.address] || null;
  const ipfsImageUrl = `https://blush-select-dog-727.mypinata.cloud/ipfs/${card.ipfsData?.image.replace(
    "ipfs://",
    ""
  )}`;
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (cardImage) {
      const img = new Image();
      img.src = ipfsImageUrl;
      img.onload = () => {
        setLoading(false);
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.log("Image load error");
        setLoading(false);
        setImageLoaded(false);
      };
    } else {
      setLoading(false);
      setImageLoaded(false);
    }
  }, [cardImage, ipfsImageUrl]);

  return (
    <Skeleton
      loading={loading}
      style={{
        height: "250px", // Adjust this value to match your card height
        width: "100%",
        borderRadius: "8px",
      }}
    >
      <PowerCardContainer onClick={() => setSelectedCard(card, false)}>
        <div>
          {cardImage ? (
            imageLoaded ? (
              <img src={ipfsImageUrl} alt={card.name} />
            ) : (
              <p>Image failed to load</p>
            )
          ) : (
            <p>No image available</p>
          )}
        </div>
      </PowerCardContainer>
    </Skeleton>
  );
};
