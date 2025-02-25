import { PowerCardContainer } from "./power-card-styles";

import zengarden from "../../../../assets/images/power-cards/zengarden.png";

export function PowerCard() {
  return (
    <PowerCardContainer>
      <img src={zengarden} alt="Example" />
    </PowerCardContainer>
  );
}
