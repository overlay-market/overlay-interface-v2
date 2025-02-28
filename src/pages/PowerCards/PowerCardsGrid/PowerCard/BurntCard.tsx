import { PowerCardContainer } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { CardData } from "../../types";

type BurntCardProps = {
  card: CardData;
};

export const BurntCard: React.FC<BurntCardProps> = ({ card }) => {
  return (
    <PowerCardContainer>
      <div className="grayscale">
        <img src={zengarden} alt="Example" />
      </div>
    </PowerCardContainer>
  );
};
