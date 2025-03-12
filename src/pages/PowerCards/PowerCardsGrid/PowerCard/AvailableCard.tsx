import { PowerCardContainer } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { CardData } from "../../types";

type AvailableCardProps = {
  card: CardData;
  setSelectedCard: Function;
  isOwned: boolean;
};

export const AvailableCard: React.FC<AvailableCardProps> = ({
  card,
  setSelectedCard,
}) => {
  return (
    <PowerCardContainer onClick={() => setSelectedCard(card, false)}>
      <div>
        <img src={zengarden} alt="Example" />
      </div>
    </PowerCardContainer>
  );
};
