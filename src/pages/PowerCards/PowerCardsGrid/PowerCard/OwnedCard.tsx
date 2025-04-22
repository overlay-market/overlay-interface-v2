import { PowerCardContainer } from "./power-card-styles";
import { UnifiedCardData } from "../../types";
import React, { useEffect, useState } from "react";
import { GradientSolidButton } from "../../../../components/Button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

type OwnedCardProps = {
  card: UnifiedCardData;
};

export const OwnedCard: React.FC<OwnedCardProps> = ({ card }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  }, [card, location.state?.refresh]);

  if (!cardData && Number(card.amount) !== 0) return <div>Loading...</div>;

  return (
    <>
      {Array.from({ length: Number(card.amount) || 0 }, (_, index) => (
        <PowerCardContainer
          key={`${card.token?.tokenId}-${index}`}
          style={{
            paddingBottom: "70%",
          }}
          backgroundImageUrl={`https://blush-select-dog-727.mypinata.cloud/ipfs/${cardData?.image.replace(
            "ipfs://",
            ""
          )}`}
        >
          <div className="card-side front">
            <img
              src={`https://blush-select-dog-727.mypinata.cloud/ipfs/${cardData?.image.replace(
                "ipfs://",
                ""
              )}`}
              alt={cardData?.name}
            />
          </div>
          <div className="card-side back">
            <GradientSolidButton
              handleClick={() =>
                navigate(
                  `/power-cards?view=details&tab=${
                    searchParams.get("tab") || "1"
                  }`,
                  {
                    state: {
                      card: { ...card, ipfsData: cardData },
                      isOwned: true,
                    },
                    replace: true,
                  }
                )
              }
              title="View More"
            />
          </div>
        </PowerCardContainer>
      ))}
    </>
  );
};
