import { GradientOutlineButton } from "../../../components/Button/GradientButton";

export const TradeButtonComponent = () => {
  return (
    <GradientOutlineButton
      title={"Trade"}
      width={"100%"}
      height={"40px"}
      onClick={() => {
        console.log("trade");
      }}
    />
  );
};
