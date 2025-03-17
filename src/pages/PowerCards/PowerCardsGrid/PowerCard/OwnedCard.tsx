import { PowerCardContainer } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { CardData } from "../../types";
import React from "react";
import { GradientSolidButton } from "../../../../components/Button";
import { useUserPowerCards } from "../../../../hooks/useUserPowerCards";

type OwnedCardProps = {
  card: CardData;
  setSelectedCard: Function;
};

export const OwnedCard: React.FC<OwnedCardProps> = ({
  card,
  setSelectedCard,
}) => {
  const { loading, error, data } = useUserPowerCards();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Data:", data);

  return (
    <PowerCardContainer style={{ paddingBottom: "136%" }}>
      <div className="card-side front">
        <img src={zengarden} alt="Example" />
      </div>
      <div className="card-side back">
        <GradientSolidButton
          handleClick={() => setSelectedCard(card, true)}
          title="View More"
        />
      </div>
    </PowerCardContainer>
  );
};
