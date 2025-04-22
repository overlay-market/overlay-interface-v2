import { PowerCardContainer } from "./power-card-styles";
import { UnifiedCardData } from "../../types";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@radix-ui/themes";
type BurntCardProps = {
  card: UnifiedCardData;
};

export const BurntCard: React.FC<BurntCardProps> = ({ card }) => {
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

  const burntCount = parseInt(card.burnt as string) || 0;

  const imageUrl = useMemo(() => {
    if (!cardData?.image) return "";
    return `https://blush-select-dog-727.mypinata.cloud/ipfs/${cardData.image.replace(
      "ipfs://",
      ""
    )}`;
  }, [cardData?.image]);

  return (
    <>
      {Array.from({ length: burntCount }).map((_, index) => (
        <Skeleton
          loading={!cardData}
          style={{
            height: "250px", // Adjust this value to match your card height
            width: "100%",
            borderRadius: "8px",
          }}
        >
          <PowerCardContainer key={`burnt-${index}`}>
            <div className="grayscale">
              <img src={imageUrl} alt={cardData?.name} />
            </div>
          </PowerCardContainer>
        </Skeleton>
      ))}
    </>
  );
};
