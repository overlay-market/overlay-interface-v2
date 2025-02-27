import { PowerCardContainer } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { CardData } from "../../types";

type AvailableCardProps = {
  card: CardData;
  setSelectedCard: Function;
};

export const AvailableCard: React.FC<AvailableCardProps> = ({
  card,
  setSelectedCard,
}) => {
  return (
    <PowerCardContainer onClick={() => setSelectedCard(card)}>
      <div>
        <img src={zengarden} alt="Example" />
      </div>
    </PowerCardContainer>
  );
};
