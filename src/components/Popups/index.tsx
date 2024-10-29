import { useActivePopups } from "../../state/application/hooks";
import Popup from "./Popup";
import { PopupsContainer } from "./popups-styles";

const Popups: React.FC = () => {
  const activePopups = useActivePopups();

  if (activePopups.length === 0) return <span />;

  return (
    <PopupsContainer>
      {activePopups.map((popup) => (
        <Popup
          key={popup.key}
          content={popup.content}
          popKey={popup.key}
          removeAfterMs={popup.removeAfterMs}
        />
      ))}
    </PopupsContainer>
  );
};

export default Popups;
