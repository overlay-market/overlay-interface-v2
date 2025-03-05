import { PowerCardContainer, CardButton } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { CardData } from "../../types";
import React from "react";

type OwnedCardProps = {
  card: CardData;
};

export const OwnedCard: React.FC<OwnedCardProps> = () => {
  return (
    <PowerCardContainer>
      <div className="card-side front">
        <img src={zengarden} alt="Example" />
      </div>
      <div className="card-side back">
        <CardButton>View More</CardButton>
      </div>
    </PowerCardContainer>
  );
};
