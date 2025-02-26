import { PowerCardContainer, CardButton } from "./power-card-styles";
import zengarden from "../../../../assets/images/power-cards/zengarden.png";

export function PowerCard() {
  return (
    <PowerCardContainer>
      <div className="card-side front">
        <img src={zengarden} alt="Example" />
      </div>
      <div className="card-side back">
        <CardButton>Burn Card</CardButton>
      </div>
    </PowerCardContainer>
  );
}
