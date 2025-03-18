import { PowerCardContainer } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";
import { CardData } from "../../types";
import { useAllPowerCards } from "../../../../hooks/useUserPowerCards";

type AvailableCardProps = {
  card: CardData;
  setSelectedCard: Function;
};

export const AvailableCard: React.FC<AvailableCardProps> = ({
  card,
  setSelectedCard,
}) => {
  const { loading, error, data } = useAllPowerCards();
  console.log("data:", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <PowerCardContainer onClick={() => setSelectedCard(card, false)}>
      <div>
        <img src={zengarden} alt="Example" />
      </div>
    </PowerCardContainer>
  );
};
