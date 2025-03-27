import { PowerCardContainer } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { UnifiedCardData } from "../../types";

type BurntCardProps = {
  card: UnifiedCardData;
};

export const BurntCard: React.FC<BurntCardProps> = () => {
  return (
    <PowerCardContainer>
      <div className="grayscale">
        <img src={zengarden} alt="Example" />
      </div>
    </PowerCardContainer>
  );
};
