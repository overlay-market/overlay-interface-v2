import { CardData } from "./types";
import samuraiJack from "../../assets/images/power-cards/samuraijack.png";

type OpenedPoweerCardProps = {
  card: CardData;
};

const OpenedPowerCard: React.FC<OpenedPoweerCardProps> = ({ card }) => {
  return (
    <div>
      <div>
        <img src={samuraiJack} alt={card.name} />
        <h2>{card.name}</h2>
        <p>
          <strong>Stats:</strong> {card.rarity}
        </p>
        <p>
          <strong>Info:</strong> {card.duration}
        </p>
      </div>
    </div>
  );
};

export default OpenedPowerCard;
