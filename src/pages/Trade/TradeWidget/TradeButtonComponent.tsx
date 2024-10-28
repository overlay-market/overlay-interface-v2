import { GradientOutlineButton } from "../../../components/Button";

const TradeButtonComponent: React.FC = () => {
  return (
    <GradientOutlineButton
      title={"Trade"}
      width={"100%"}
      height={"40px"}
      handleClick={() => {
        console.log("trade");
      }}
    />
  );
};

export default TradeButtonComponent;
